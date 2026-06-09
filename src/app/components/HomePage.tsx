"use client";

import Image from "next/image";
import Link from "next/link";
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
    <svg viewBox="0 0 40 32" className="h-7 w-9 shrink-0" fill="none" aria-hidden="true">
      <path d="M4 28 L20 4 L36 28" stroke="white" strokeWidth="2" />
      <path d="M12 28 L20 16 L28 28" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

function FooterDecor() {
  return (
    <svg
      viewBox="0 0 120 24"
      className="h-5 w-24 shrink-0 text-white"
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
    <div className="mt-1 flex items-end gap-[3px] px-2">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div
            className="w-px bg-white"
            style={{ height: i % 2 === 0 ? 10 : 6 }}
          />
          <span className="text-[7px] text-white/70">{i}</span>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [photoError, setPhotoError] = useState(false);
  const [gifError, setGifError] = useState(false);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-black p-3 sm:p-6">
      <Link
        href="/hub"
        className="group w-full max-w-4xl border border-white/90 transition-colors hover:border-white"
        aria-label="Enter Luffy's Hub"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/40 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="font-[family-name:var(--font-orbitron)] text-xl tracking-[0.35em] text-white sm:text-2xl">
              LUFFY
            </span>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <HexOutline className="h-4 w-4 text-white" />
            <HexOutline className="h-4 w-4 text-white" />
            <HexOutline className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 border-b border-white/40 sm:grid-cols-[minmax(140px,220px)_1fr]">
          {/* Photo */}
          <div className="relative aspect-square border-b border-white/40 sm:border-b-0 sm:border-r sm:border-white/40">
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
            <div className="relative flex h-full w-full items-center justify-center p-3">
              {!photoError ? (
                <Image
                  src={PHOTO_PATH}
                  alt="Profile photo"
                  fill
                  className="object-cover object-center grayscale"
                  onError={() => setPhotoError(true)}
                  priority
                  sizes="(max-width: 640px) 100vw, 220px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center border border-dashed border-white/30 bg-black/60 text-center text-[10px] leading-relaxed text-white/40">
                  photo
                  <br />
                  public/home/photo.jpg
                </div>
              )}
            </div>
          </div>

          {/* Info panel */}
          <div className="flex flex-col text-white">
            <div className="border-b border-white/40 px-4 py-3 sm:px-5">
              <p className="text-[11px] tracking-widest text-white/90 sm:text-xs">
                LUFFY, HUB
              </p>
              <div className="mt-2 inline-block bg-white px-3 py-1">
                <span className="font-[family-name:var(--font-orbitron)] text-[10px] font-bold tracking-[0.25em] text-black sm:text-xs">
                  PROCRASTINATOR
                </span>
              </div>
              <p className="mt-2 text-[10px] tracking-wider text-white/60">
                PRCR.4T42
              </p>
            </div>

            <div className="grid grid-cols-1 border-b border-white/40 text-[9px] tracking-wide sm:grid-cols-2 sm:text-[10px]">
              <div className="border-b border-white/20 px-4 py-2 sm:border-b-0 sm:border-r sm:border-white/20 sm:px-5">
                <span className="text-white/50">TOUR START:</span> 29.09.2035
              </div>
              <div className="border-b border-white/20 px-4 py-2 sm:border-b-0 sm:px-5">
                <span className="text-white/50">HA:</span> E95381.NJ814
              </div>
              <div className="border-b border-white/20 px-4 py-2 sm:border-b-0 sm:border-r sm:border-white/20 sm:px-5">
                <span className="text-white/50">TOUR END:</span> EXTEND
              </div>
              <div className="px-4 py-2 sm:px-5">
                <span className="text-white/50">HI:</span> E95381
              </div>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-3 px-4 py-3 sm:grid-cols-[auto_1fr] sm:px-5">
              {/* GIF / hex flower area */}
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center sm:mx-0 sm:h-28 sm:w-28">
                {!gifError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={GIF_PATH}
                    alt="Animation"
                    className="h-full w-full object-contain"
                    onError={() => setGifError(true)}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center border border-dashed border-white/30 text-center text-[8px] leading-relaxed text-white/40">
                    gif
                    <br />
                    public/home/
                    <br />
                    animation.gif
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center">
                <p className="font-[family-name:var(--font-orbitron)] text-2xl tracking-[0.15em] sm:text-3xl">
                  33&nbsp;&nbsp;74&nbsp;&nbsp;17&nbsp;&nbsp;90
                </p>
                <p className="mt-2 text-[9px] text-white/50 sm:text-[10px]">
                  luffy@hub.terminal
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 border-t border-white/40 px-4 py-2 text-[8px] leading-relaxed text-white/45 sm:px-5 sm:text-[9px]">
              <div className="space-y-0.5">
                <p>&gt;LUF</p>
                <p>&gt;AGE 20</p>
                <p>&gt;BANGALORE, IN</p>
                <p>&gt;EYES BRO</p>
                <p>&gt;HAIR BLK</p>
                <p>&gt;HGT 175</p>
              </div>
              <div className="space-y-0.5">
                <p>&gt;WGT 65</p>
                <p>&gt;BLOOD O+</p>
                <p>&gt;UNIT DS-2</p>
                <p>&gt;CLEAR Y</p>
                <p>&gt;AUTH LVL 3</p>
                <p>&gt;STATUS ACTIVE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-2 px-4 py-3 sm:flex-row sm:justify-between sm:px-6">
          <div className="flex items-center gap-2">
            <FooterDecor />
            <span className="text-[8px] tracking-[0.2em] text-white/70 sm:text-[9px]">
              LUFFY&apos;S HUB
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[9px] tracking-[0.3em] text-white sm:text-[10px]">
              HAN-IV PERSONNEL
            </span>
            <RulerScale />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[8px] tracking-[0.2em] text-white/70 sm:text-[9px]">
              LUFFY CORPORATION
            </span>
            <FooterDecor />
          </div>
        </div>

        <p className="border-t border-white/20 py-2 text-center text-[9px] tracking-widest text-white/30 opacity-0 transition-opacity group-hover:opacity-100">
          click to enter →
        </p>
      </Link>
    </div>
  );
}
