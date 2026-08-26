import { javaLabPrograms } from "./preloadedJavaLab";
import { preloadedPrograms } from "./preloadedPrograms";
import { contentKey, ContentMap, emptyBucket } from "./types";

export interface HubMeta {
  content: ContentMap;
  subjects: Record<string, string[]>;
  updatedAt?: string;
}

export function buildDefaultHubContent(): HubMeta {
  const content: ContentMap = {
    [contentKey("2nd Sem", "data structures")]: {
      programs: preloadedPrograms,
      notes: [],
      important: [],
    },
    [contentKey("3rd Sem", "java lab")]: {
      programs: javaLabPrograms,
      notes: [],
      important: [],
    },
  };
  return { content, subjects: {}, updatedAt: new Date().toISOString() };
}

export function ensureBucket(content: ContentMap, key: string) {
  return content[key] ?? emptyBucket();
}
