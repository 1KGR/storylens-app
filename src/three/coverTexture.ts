import * as THREE from "three";
import type { Film } from "../data/films";

const loader = new THREE.TextureLoader();
loader.crossOrigin = "anonymous";

const textureCache = new Map<string, THREE.Texture>();

export function loadPosterTexture(url: string): Promise<THREE.Texture> {
  if (textureCache.has(url)) return Promise.resolve(textureCache.get(url)!);
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        textureCache.set(url, tex);
        resolve(tex);
      },
      undefined,
      reject
    );
  });
}

/** StoryLens's own generated cover art — a gradient field, the film's initial, and its
 * title/category, drawn to a canvas. This is what renders whenever no real poster is
 * configured (the default for this prototype, since it ships with no TMDB key). */
export function generateCoverTexture(film: Film): THREE.Texture {
  const key = `gen:${film.slug}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const w = 512;
  const h = 768;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, w * 0.75, h);
  grad.addColorStop(0, film.gradient[0]);
  grad.addColorStop(1, film.gradient[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // restrained grain
  const imageData = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 14;
    imageData.data[i] += n;
    imageData.data[i + 1] += n;
    imageData.data[i + 2] += n;
  }
  ctx.putImageData(imageData, 0, 0);

  // bottom vignette so title text stays legible
  const vignette = ctx.createLinearGradient(0, h * 0.55, 0, h);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.62)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, h * 0.55, w, h * 0.45);

  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.font = "italic 460 160px Georgia, serif";
  ctx.fillText(film.mark, 28, 170);

  ctx.fillStyle = "rgba(243,236,221,0.72)";
  ctx.font = "600 15px sans-serif";
  ctx.fillText((film.categories[0] ?? "").replace(/-/g, " ").toUpperCase(), 28, h - 96);

  ctx.fillStyle = "#f3ecdd";
  ctx.font = "italic 500 34px Georgia, serif";
  wrapText(ctx, film.title, 28, h - 60, w - 56, 38);

  ctx.fillStyle = "rgba(243,236,221,0.6)";
  ctx.font = "400 15px sans-serif";
  ctx.fillText(`${film.year} · ${film.director}`, 28, h - 20);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  textureCache.set(key, tex);
  return tex;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, yBaseline: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  const lines: string[] = [];
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  lines.push(line);
  const startY = yBaseline - (lines.length - 1) * lineHeight;
  lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
}

/** The case body's interior lining — a plain warm paper color with restrained grain and a
 * soft vignette near the edges, so the open case's inside reads as a real material surface
 * rather than a flat rendered color. Shared across every film, generated once. */
export function generateInteriorTexture(): THREE.Texture {
  const key = "interior-lining";
  if (textureCache.has(key)) return textureCache.get(key)!;

  const w = 512;
  const h = 768;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#efe7d2";
  ctx.fillRect(0, 0, w, h);

  const imageData = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 8;
    imageData.data[i] += n;
    imageData.data[i + 1] += n;
    imageData.data[i + 2] += n;
  }
  ctx.putImageData(imageData, 0, 0);

  const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.65);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.16)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  textureCache.set(key, tex);
  return tex;
}

/** A soft radial drop-shadow blob, shared by every case on a shelf row. The row's
 * camera looks straight at the shelf (a "photograph" framing, not an elevated/top-down
 * one), so a real floor-plane contact shadow would render nearly edge-on and vanish —
 * this is a simple always-facing-camera fake shadow instead, cheap and reliable. */
export function generateShadowTexture(): THREE.Texture {
  const key = "case-shadow";
  if (textureCache.has(key)) return textureCache.get(key)!;

  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(0,0,0,0.55)");
  grad.addColorStop(0.6, "rgba(0,0,0,0.28)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  textureCache.set(key, tex);
  return tex;
}

/** The disc's label face — the same gold/red/olive conic sweep as the existing
 * CSS .disc-graphic, drawn once and shared by every case (a StoryLens house
 * disc design, not per-film artwork). Used as the map on a real cylinder
 * mesh, not a flat CSS circle. */
export function generateDiscTexture(): THREE.Texture {
  const key = "disc-label";
  if (textureCache.has(key)) return textureCache.get(key)!;

  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  // concentric rings rather than a conic sweep — keeps this to well-supported
  // 2D canvas primitives only, still reads as a label catching light
  const ringColors = ["#c9a227", "#a5323a", "#767a4c", "#c9a227", "#a5323a"];
  ringColors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r * (1 - i * 0.15), 0, Math.PI * 2);
    ctx.fill();
  });

  const sheen = ctx.createRadialGradient(cx - r * 0.24, cy - r * 0.3, 0, cx, cy, r * 0.9);
  sheen.addColorStop(0, "rgba(255,255,255,0.4)");
  sheen.addColorStop(0.45, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = size * 0.012;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  textureCache.set(key, tex);
  return tex;
}

export function generateSpineTexture(film: Film): THREE.Texture {
  const key = `spine:${film.slug}`;
  if (textureCache.has(key)) return textureCache.get(key)!;
  const w = 64;
  const h = 768;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "rgba(255,255,255,0.16)");
  grad.addColorStop(0.5, film.gradient[1]);
  grad.addColorStop(1, "rgba(0,0,0,0.5)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(w / 2 + 6, h / 2 + 70);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "rgba(243,236,221,0.75)";
  ctx.font = "600 15px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(film.title.toUpperCase(), 0, 0);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  textureCache.set(key, tex);
  return tex;
}
