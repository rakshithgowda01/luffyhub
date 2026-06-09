"use client";

import Image from "next/image";
import { useState } from "react";

const PHOTO_PATH = "/home/photo.jpg";
const GIF_PATH = "/home/animation.gif";

function HexOutline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 28" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 1 L23 7.5 V20.5 L12 27 L1 20.5 V7.5 Z"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 40 32" className="h-6 w-8 shrink-0 sm:h-7 sm:w-9" fill="none" aria-hidden="true">
      <path d="M4 28 L20 4 L36 28" stroke="white" strokeWidth="2" />
      <path d="M12 28 L20 16 L28 28" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

function FooterDecor() {
  return (
    <svg
      viewBox="0 0 120 24"
      className="hidden h-5 w-20 shrink-0 text-white sm:block sm:w-24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M0 12 H30 M90 12 H120" stroke="currentColor" strokeWidth="1" />
      <path d="M30 12 L45 4 L60 12 L45 20 Z" stroke="currentColor" strokeWidth="1" />
      <path d="M60 12 L75 4 L90 12 L75 20 Z" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function RulerScale() {
  return (
    <div className="mt-1 flex items-end gap-[2px] px-1 sm:gap-[3px] sm:px-2">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div
            className="w-px bg-white"
            style={{ height: i % 2 === 0 ? 8 : 5 }}
          />
          <span className="text-[6px] text-white/70 sm:text-[7px]">{i}</span>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [photoError, setPhotoError] = useState(false);
  const [gifError, setGifError] = useState(false);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-black p-2 sm:p-4">
      <div className="flex min-h-0 flex-1 flex-col border border-white/90">
        {/* Card header */}
        <div className="flex items-center justify-between border-b border-white/40 px-3 py-2 sm:px-6 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <LogoMark />
            <span className="font-[family-name:var(--font-orbitron)] text-lg tracking-[0.3em] text-white sm:text-2xl sm:tracking-[0.35em]">
              LUFFY
            </span>
          </div>
          <div className="flex gap-1.5 sm:gap-3">
            <HexOutline className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
            <HexOutline className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
            <HexOutline className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
          </div>
        </div>

        {/* Main — grows to fill screen */}
        <div className="grid min-h-0 flex-1 grid-cols-1 sm:grid-cols-[minmax(160px,28%)_1fr]">
          {/* Photo */}
          <div className="relative min-h-[200px] border-b border-white/40 sm:min-h-0 sm:border-b-0 sm:border-r sm:border-white/40">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(135deg, rgba(255,255,255,0.07) 25%, transparent 25%),
                  linear-gradient(225deg, rgba(255,255,255,0.07) 25%, transparent 25%),
                  linear-gradient(45deg, rgba(255,255,255,0.07) 25%, transparent 25%),
                  linear-gradient(315deg, rgba(255,255,255,0.07) 25%, transparent 25%)
                `,
                backgroundSize: "20px 20px",
                backgroundPosition: "10px 0, 10px 0, 0 0, 0 0",
              }}
            />
            <div className="relative h-full min-h-[200px] w-full sm:min-h-full">
              {!photoError ? (
                <Image
                  src={PHOTO_PATH}
                  alt="Profile photo"
                  fill
                  className="object-cover object-center grayscale"
                  onError={() => setPhotoError(true)}
                  priority
                  sizes="(max-width: 640px) 100vw, 28vw"
                />
              ) : (
                <div className="flex h-full min-h-[200px] items-center justify-center border border-dashed border-white/30 bg-black/60 p-4 text-center text-[10px] leading-relaxed text-white/40 sm:min-h-full">
                  drop your photo at
                  <br />
                  public/home/photo.jpg
                </div>
              )}
            </div>
          </div>

          {/* Info panel */}
          <div className="flex min-h-0 flex-col text-white">
            <div className="border-b border-white/40 px-3 py-3 sm:px-5">
              <p className="text-[10px] tracking-widest text-white/90 sm:text-xs">
                LUFFY, HUB
              </p>
              <div className="mt-2 inline-block bg-white px-2.5 py-1 sm:px-3">
                <span className="font-[family-name:var(--font-orbitron)] text-[9px] font-bold tracking-[0.2em] text-black sm:text-xs sm:tracking-[0.25em]">
                  PROCRASTINATOR
                </span>
              </div>
              <p className="mt-2 text-[9px] tracking-wider text-white/60 sm:text-[10px]">
                PRCR.4T42
              </p>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-4 px-3 py-4 sm:flex-row sm:gap-6 sm:px-5 sm:py-5">
              {/* GIF */}
              <div className="relative mx-auto flex h-28 w-28 shrink-0 items-center justify-center sm:mx-0 sm:h-32 sm:w-32">
                {!gifError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={GIF_PATH}
                    alt="Animation"
                    className="h-full w-full object-contain"
                    onError={() => setGifError(true)}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center border border-dashed border-white/30 p-2 text-center text-[8px] leading-relaxed text-white/40">
                    drop your gif at
                    <br />
                    public/home/animation.gif
                  </div>
                )}
              </div>

              {/* About Luffy's Hub */}
              <div className="flex flex-1 flex-col justify-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 sm:text-xs">
                  about luffy&apos;s hub
                </p>
                <p className="mt-2 text-xs leading-relaxed text-white/80 sm:text-sm sm:leading-relaxed">
                  Luffy&apos;s Hub is a college supporter platform built for
                  students — access lab programs as quick cheats, browse notes,
                  and find important study material semester-wise. pick your sem,
                  subject, and tab above to get started.
                </p>
                <ul className="mt-3 space-y-1 text-[10px] text-white/50 sm:text-xs">
                  <li>&gt; lab programs — copy &amp; download code</li>
                  <li>&gt; notes — subject notes (coming soon)</li>
                  <li>&gt; important — key topics (coming soon)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-2 border-t border-white/40 px-3 py-2 sm:flex-row sm:justify-between sm:px-6 sm:py-3">
          <div className="flex items-center gap-2">
            <FooterDecor />
            <span className="text-[7px] tracking-[0.15em] text-white/70 sm:text-[9px] sm:tracking-[0.2em]">
              LUFFY&apos;S HUB
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[8px] tracking-[0.25em] text-white sm:text-[10px] sm:tracking-[0.3em]">
              HAN-IV PERSONNEL
            </span>
            <RulerScale />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[7px] tracking-[0.15em] text-white/70 sm:text-[9px] sm:tracking-[0.2em]">
              LUFFY CORPORATION
            </span>
            <FooterDecor />
          </div>
        </div>
      </div>
    </div>
  );
}
