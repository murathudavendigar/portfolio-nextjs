/** @jsxRuntime automatic */
/** @jsxImportSource react */
// Pragmas above: scripts/generate-og.tsx runs this file through tsx, outside Next.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/**
 * Share-card renderer. Only scripts/generate-og.tsx calls this, at build time,
 * so reading fonts and photos from disk is safe here.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#211d1a";
const PAPER = "#f3ede4";
const PAPER_DEEP = "#e6ddd0";
const RED = "#ca3e47";
const RED_TEXT = "#a8323a";
const BODY = "#3a414d";
const MUTED = "#6b645c";

const root = process.cwd();
const asset = (...p: string[]) => readFile(path.join(root, ...p));

async function loadFonts() {
  const [sans800, sans800Ext, sans600, sans600Ext, mono] = await Promise.all([
    asset("assets/og/nunito-sans-latin-800-normal.woff"),
    asset("assets/og/nunito-sans-latin-ext-800-normal.woff"),
    asset("assets/og/nunito-sans-latin-600-normal.woff"),
    asset("assets/og/nunito-sans-latin-ext-600-normal.woff"),
    asset("assets/og/geist-mono-latin-500-normal.woff"),
  ]);
  return [
    { name: "Nunito Sans", data: sans800, weight: 800 as const },
    { name: "Nunito Sans", data: sans800Ext, weight: 800 as const },
    { name: "Nunito Sans", data: sans600, weight: 600 as const },
    { name: "Nunito Sans", data: sans600Ext, weight: 600 as const },
    { name: "Geist Mono", data: mono, weight: 500 as const },
  ];
}

/** Same M stroke as the intro loader, with the red cursor block. */
function Mark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <rect width="32" height="32" rx="7" fill={INK} />
      <path
        d="M6.5 23 V9 L13 15.5 L19.5 9 V23"
        fill="none"
        stroke={PAPER}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="22.5" y="15.5" width="4" height="9" rx="0.75" fill={RED} />
    </svg>
  );
}

function Kicker({ children }: { children: string }) {
  return (
    <div
      style={{
        fontFamily: "Geist Mono",
        fontSize: 22,
        letterSpacing: 4,
        textTransform: "uppercase",
        color: RED_TEXT,
      }}>
      {children}
    </div>
  );
}

function Footer({ meta }: { meta?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: `2px solid ${PAPER_DEEP}`,
        paddingTop: 28,
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Mark />
        <div style={{ fontFamily: "Geist Mono", fontSize: 24, color: INK }}>
          muratoncu.com
        </div>
      </div>
      {meta ? (
        <div style={{ fontFamily: "Geist Mono", fontSize: 22, color: MUTED }}>
          {meta}
        </div>
      ) : null}
    </div>
  );
}

function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

function titleSize(title: string) {
  if (title.length <= 18) return 96;
  if (title.length <= 34) return 76;
  if (title.length <= 56) return 62;
  return 52;
}

export type OgCardProps = {
  kicker: string;
  title: string;
  description?: string;
  meta?: string;
};

/** Card for case studies, writing, and inner pages. */
export async function renderOgCard({
  kicker,
  title,
  description,
  meta,
}: OgCardProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: "64px 72px 56px",
          fontFamily: "Nunito Sans",
        }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <Kicker>{kicker}</Kicker>
          <div
            style={{
              fontSize: titleSize(title),
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              color: INK,
              maxWidth: 1000,
            }}>
            {title}
          </div>
          {description ? (
            <div
              style={{
                fontSize: 30,
                fontWeight: 600,
                lineHeight: 1.4,
                color: BODY,
                maxWidth: 960,
              }}>
              {clip(description, 150)}
            </div>
          ) : null}
        </div>
        <Footer meta={meta} />
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() },
  );
}

/** Home card: name, positioning line, and the same photo as the hero. */
export async function renderHomeOg() {
  const photo = await asset("public/img/pp.jpeg");
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: PAPER,
          fontFamily: "Nunito Sans",
        }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 56px 56px 72px",
          }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <Kicker>Frontend engineer · Netherlands</Kicker>
            <div
              style={{
                fontSize: 100,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: -2,
                color: INK,
              }}>
              Murat Öncü
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 600,
                lineHeight: 1.3,
                color: BODY,
              }}>
              I build products people actually use — on the web and in the app
              stores.
            </div>
          </div>
          <Footer />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoSrc}
          width={430}
          height={630}
          alt=""
          style={{ objectFit: "cover", objectPosition: "60% 50%" }}
        />
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() },
  );
}
