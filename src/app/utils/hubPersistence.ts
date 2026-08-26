import { promises as fs } from "fs";
import path from "path";
import { buildDefaultHubContent, HubMeta } from "./defaultHubContent";

const CONTENT_PATH = "public/hub-content.json";
const OWNER = process.env.GITHUB_OWNER || "rakshithgowda01";
const REPO = process.env.GITHUB_REPO || "luffyhub";
const BRANCH = process.env.GITHUB_BRANCH || "main";

function localPath() {
  return path.join(process.cwd(), CONTENT_PATH);
}

async function readLocalFile(): Promise<HubMeta | null> {
  try {
    const raw = await fs.readFile(localPath(), "utf8");
    return JSON.parse(raw) as HubMeta;
  } catch {
    return null;
  }
}

async function writeLocalFile(meta: HubMeta): Promise<void> {
  await fs.mkdir(path.dirname(localPath()), { recursive: true });
  await fs.writeFile(localPath(), JSON.stringify(meta, null, 2), "utf8");
}

async function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "luffyhub-admin",
  };
}

async function readFromGitHub(token: string): Promise<HubMeta | null> {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${CONTENT_PATH}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: await githubHeaders(token), cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub read failed: ${res.status}`);
  }
  const data = (await res.json()) as { content?: string; encoding?: string };
  if (!data.content) return null;
  const decoded = Buffer.from(data.content, "base64").toString("utf8");
  return JSON.parse(decoded) as HubMeta;
}

async function writeToGitHub(token: string, meta: HubMeta): Promise<void> {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${CONTENT_PATH}`;
  const headers = await githubHeaders(token);

  let sha: string | undefined;
  const existing = await fetch(`${url}?ref=${BRANCH}`, { headers, cache: "no-store" });
  if (existing.ok) {
    const body = (await existing.json()) as { sha?: string };
    sha = body.sha;
  }

  const payload = {
    message: `chore: update hub content (${new Date().toISOString()})`,
    content: Buffer.from(JSON.stringify(meta, null, 2), "utf8").toString("base64"),
    branch: BRANCH,
    ...(sha ? { sha } : {}),
  };

  const res = await fetch(url, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub write failed: ${res.status} ${text}`);
  }
}

function mergeWithDefaults(meta: HubMeta): HubMeta {
  const defaults = buildDefaultHubContent();
  return {
    content: { ...defaults.content, ...meta.content },
    subjects: meta.subjects ?? {},
    updatedAt: meta.updatedAt,
  };
}

export async function loadHubContent(): Promise<HubMeta> {
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    try {
      const fromGh = await readFromGitHub(token);
      if (fromGh) return mergeWithDefaults(fromGh);
    } catch {
      // fall through
    }
  }

  const local = await readLocalFile();
  if (local && Object.keys(local.content ?? {}).length > 0) {
    return mergeWithDefaults(local);
  }

  return buildDefaultHubContent();
}

export async function saveHubContent(meta: HubMeta): Promise<{ mode: "github" | "local" }> {
  const next: HubMeta = {
    ...meta,
    updatedAt: new Date().toISOString(),
  };
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    await writeToGitHub(token, next);
    // Keep local copy in sync for this environment
    try {
      await writeLocalFile(next);
    } catch {
      // ignore local write failures on read-only hosts
    }
    return { mode: "github" };
  }

  // Local / preview without token
  try {
    await writeLocalFile(next);
    return { mode: "local" };
  } catch {
    throw new Error(
      "Cannot save on this host without GITHUB_TOKEN. Add GITHUB_TOKEN in Vercel Project Settings → Environment Variables (repo write scope)."
    );
  }
}

export async function saveNotePdf(
  id: string,
  fileName: string,
  bytes: Buffer
): Promise<{ url: string; mode: "github" | "local" }> {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const relative = `public/notes/${id}-${safeName}`;
  const publicUrl = `/notes/${id}-${safeName}`;
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${relative}`;
    const headers = await githubHeaders(token);
    const payload = {
      message: `chore: upload note ${safeName}`,
      content: bytes.toString("base64"),
      branch: BRANCH,
    };
    const res = await fetch(url, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GitHub note upload failed: ${res.status} ${text}`);
    }
    return { url: publicUrl, mode: "github" };
  }

  const full = path.join(process.cwd(), relative);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, bytes);
  return { url: publicUrl, mode: "local" };
}
