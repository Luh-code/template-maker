import { HEART_COLS, HEART_MATRIX, HEART_ROWS, getHeartPath2D } from "@/lib/heart-layout";
import { generateMonthGrid, getOrderedDayLabels, MONTH_NAMES } from "@/lib/calendar";
import { generateBarcodeBars } from "@/lib/spotify-barcode";
import { CANVAS_FONT_FAMILY, ensureFontLoaded } from "@/lib/fonts";
import type { DesignState, UploadedImage } from "@/types";

/**
 * Reference width the on-screen layout proportions were designed against.
 * Font sizes and gaps below are tuned for this width, then scaled to the
 * actual export resolution so print output matches the live preview.
 */
const BASE_WIDTH = 1200;
const ASPECT_RATIO = 3 / 2;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawHeartGlyph(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
  filled: boolean
) {
  const path = getHeartPath2D(size, size, cx - size / 2, cy - size / 2, 48);
  ctx.save();
  if (filled) {
    ctx.fillStyle = color;
    ctx.fill(path);
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, size * 0.08);
    ctx.stroke(path);
  }
  ctx.restore();
}

function drawHeartCollage(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  design: DesignState,
  imageCache: Map<string, HTMLImageElement>,
  scale: number
) {
  ctx.save();
  ctx.translate(x, y);
  const heartPath = getHeartPath2D(w, h);
  ctx.clip(heartPath);

  const gap = 3 * scale;
  const cellW = w / HEART_COLS;
  const cellH = h / HEART_ROWS;

  HEART_MATRIX.forEach((rowArr, row) => {
    rowArr.forEach((active, col) => {
      if (!active) return;
      const cellX = col * cellW + gap / 2;
      const cellY = row * cellH + gap / 2;
      const cellWidth = cellW - gap;
      const cellHeight = cellH - gap;

      const tile = design.tiles[`tile_${row}_${col}`];
      const image = tile?.imageId ? design.images.find((i) => i.id === tile.imageId) : undefined;
      const radiusPx = ((tile?.radius ?? 0) / 100) * Math.min(cellWidth, cellHeight);

      ctx.save();
      roundedRectPath(ctx, cellX, cellY, cellWidth, cellHeight, radiusPx);
      ctx.clip();

      if (image) {
        const loaded = imageCache.get(image.id);
        if (loaded) {
          drawCoverImage(ctx, loaded, image, cellX, cellY, cellWidth, cellHeight, tile);
        }
      } else {
        ctx.fillStyle = "#e2e2e2";
        ctx.fillRect(cellX, cellY, cellWidth, cellHeight);
      }
      ctx.restore();
    });
  });

  ctx.restore();
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  image: UploadedImage,
  cellX: number,
  cellY: number,
  cellW: number,
  cellH: number,
  tile: { offsetX: number; offsetY: number; zoom: number; rotation: number }
) {
  const centerX = cellX + cellW / 2;
  const centerY = cellY + cellH / 2;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((tile.rotation * Math.PI) / 180);
  ctx.scale(tile.zoom, tile.zoom);
  ctx.translate((tile.offsetX / 100) * cellW, (tile.offsetY / 100) * cellH);

  const imgAspect = img.width / img.height;
  const cellAspect = cellW / cellH;
  let drawW: number;
  let drawH: number;
  if (imgAspect > cellAspect) {
    drawH = cellH;
    drawW = cellH * imgAspect;
  } else {
    drawW = cellW;
    drawH = cellW / imgAspect;
  }

  ctx.filter = `brightness(${image.brightness}%) contrast(${image.contrast}%) saturate(${image.saturation}%)`;
  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.filter = "none";
  ctx.restore();
}

function drawCalendar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  design: DesignState,
  textColor: string,
  scale: number
) {
  const { calendar, frame } = design;
  const weeks = generateMonthGrid(calendar.month, calendar.year, calendar.weekStartsMonday);
  const dayLabels = getOrderedDayLabels(calendar.dayLabels, calendar.weekStartsMonday);
  const monthLabel = MONTH_NAMES[calendar.dayLabels][calendar.month];

  let cursorY = y;

  const monthFontFamily = CANVAS_FONT_FAMILY[design.text.font];
  ctx.fillStyle = frame.accentColor;
  ctx.font = `${20 * scale}px "${monthFontFamily}", cursive`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`${monthLabel} ${calendar.year}`, x, cursorY);
  cursorY += 30 * scale;

  ctx.strokeStyle = textColor === "#2a2a2a" ? "rgba(0,0,0,0.15)" : "rgba(232,200,116,0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, cursorY);
  ctx.lineTo(x + w, cursorY);
  ctx.stroke();
  cursorY += 10 * scale;

  const colW = w / 7;
  ctx.font = `600 ${12 * scale}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = textColor;
  dayLabels.forEach((label, i) => {
    ctx.fillText(label, x + colW * i + colW / 2, cursorY);
  });
  ctx.globalAlpha = 1;
  cursorY += 18 * scale;

  const rowH = 20 * scale;
  ctx.font = `${12 * scale}px system-ui, sans-serif`;
  weeks.forEach((week) => {
    week.forEach((day, i) => {
      if (day === null) return;
      const cx = x + colW * i + colW / 2;
      const cy = cursorY + rowH / 2;
      const isSpecial = day === calendar.specialDate;
      if (isSpecial) {
        const filled = calendar.highlightStyle === "filled";
        drawHeartGlyph(ctx, cx, cy + 1 * scale, 18 * scale, "#ef4444", filled);
        ctx.fillStyle = filled ? "#ffffff" : "#ef4444";
      } else {
        ctx.fillStyle = textColor;
      }
      ctx.textBaseline = "middle";
      ctx.fillText(String(day), cx, cy);
    });
    cursorY += rowH;
  });
}

function drawSpotify(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  design: DesignState,
  barcodeImg: HTMLImageElement | null,
  scale: number
) {
  const { spotify, frame, text } = design;
  const glyphSize = 16 * scale;

  // Minimal Spotify glyph: a ring with three curved sound-wave lines.
  ctx.save();
  ctx.strokeStyle = frame.accentColor;
  ctx.lineWidth = 1.4 * scale;
  ctx.beginPath();
  ctx.arc(x + glyphSize / 2, y + glyphSize / 2, glyphSize / 2 - 1, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 3; i++) {
    const ry = y + glyphSize * (0.35 + i * 0.2);
    ctx.beginPath();
    ctx.moveTo(x + glyphSize * 0.28, ry);
    ctx.quadraticCurveTo(x + glyphSize * 0.5, ry - glyphSize * 0.12, x + glyphSize * 0.75, ry + glyphSize * 0.05);
    ctx.stroke();
  }
  ctx.restore();

  const barsX = x + glyphSize + 10 * scale;
  const barsW = w - glyphSize - 10 * scale;
  const barsH = 22 * scale;

  if (barcodeImg) {
    const ratio = barcodeImg.width / barcodeImg.height;
    const drawH = barsH;
    const drawW = Math.min(barsW, drawH * ratio);
    ctx.drawImage(barcodeImg, barsX, y - 3 * scale, drawW, drawH);
  } else {
    const bars = generateBarcodeBars(spotify.url || spotify.songName);
    const barGap = 2 * scale;
    const barW = Math.max(1, (barsW - bars.length * barGap) / bars.length);
    let bx = barsX;
    ctx.fillStyle = frame.accentColor;
    for (const heightFraction of bars) {
      const barH = barsH * heightFraction;
      ctx.fillRect(bx, y + (barsH - barH) / 2, barW, barH);
      bx += barW + barGap;
    }
  }

  ctx.fillStyle = text.color;
  ctx.globalAlpha = 0.85;
  ctx.font = `${11 * scale}px system-ui, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const caption = [spotify.songName, spotify.artist].filter(Boolean).join(" — ");
  ctx.fillText(caption, x, y + glyphSize + 6 * scale);
  ctx.globalAlpha = 1;
}

async function preloadImages(images: UploadedImage[]): Promise<Map<string, HTMLImageElement>> {
  const cache = new Map<string, HTMLImageElement>();
  await Promise.all(
    images.map(async (image) => {
      try {
        cache.set(image.id, await loadImage(image.src));
      } catch {
        // Skip images that fail to decode rather than aborting the whole export.
      }
    })
  );
  return cache;
}

/**
 * Renders the current design to an off-screen canvas at print resolution.
 * `exportWidth` in px at 300 DPI: 3000px ≈ 10in wide print.
 */
export async function renderFrameToCanvas(
  design: DesignState,
  exportWidth = 3000
): Promise<HTMLCanvasElement> {
  await ensureFontLoaded(design.text.font);

  const width = exportWidth;
  const height = Math.round(exportWidth / ASPECT_RATIO);
  const scale = exportWidth / BASE_WIDTH;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.fillStyle = design.frame.backgroundColor;
  ctx.fillRect(0, 0, width, height);

  const imageCache = await preloadImages(design.images);
  const barcodeImg = design.spotify.barcodeImage
    ? await loadImage(design.spotify.barcodeImage).catch(() => null)
    : null;

  const padX = width * 0.05;
  const padY = height * 0.05;
  const contentW = width * 0.9;
  const contentH = height * 0.9;
  const fontFamily = CANVAS_FONT_FAMILY[design.text.font];

  if (design.template === "black-anniversary") {
    const titleY = padY;
    const titleFontPx = 34 * scale;
    const heartSize = 16 * scale;
    const spacing = 12 * scale;

    ctx.font = `${titleFontPx}px "${fontFamily}", cursive`;
    const primaryW = ctx.measureText(design.text.primary).width;
    const secondaryW = ctx.measureText(design.text.secondary).width;
    const totalW = primaryW + spacing + heartSize + spacing + secondaryW;
    const startX = padX + contentW / 2 - totalW / 2;

    ctx.fillStyle = design.text.color;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(design.text.primary, startX, titleY);
    drawHeartGlyph(
      ctx,
      startX + primaryW + spacing + heartSize / 2,
      titleY + titleFontPx * 0.42,
      heartSize,
      "#ef4444",
      true
    );
    ctx.fillText(design.text.secondary, startX + primaryW + spacing * 2 + heartSize, titleY);

    const bodyY = titleY + 60 * scale;
    const bodyH = contentH - 60 * scale;
    const collageW = contentW * 0.48;
    const gap = contentW * 0.06;

    drawHeartCollage(ctx, padX, bodyY, collageW, bodyH, design, imageCache, scale);

    const rightX = padX + collageW + gap;
    const rightW = contentW - collageW - gap;
    const spotifyY = bodyY + bodyH * 0.32;
    drawSpotify(ctx, rightX, spotifyY, rightW, design, barcodeImg, scale);
    drawCalendar(ctx, rightX, spotifyY + 70 * scale, rightW, design, design.text.color, scale);
  } else {
    ctx.fillStyle = design.text.color;
    ctx.font = `${34 * scale}px "${fontFamily}", cursive`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(design.text.primary, padX + contentW / 2, padY);

    let bodyOffset = 55 * scale;
    if (design.text.secondary) {
      ctx.fillStyle = "#737373";
      ctx.font = `${12 * scale}px system-ui, sans-serif`;
      ctx.fillText(design.text.secondary, padX + contentW / 2, padY + 40 * scale);
      bodyOffset += 20 * scale;
    }

    const bodyY = padY + bodyOffset;
    const bodyH = contentH - bodyOffset;
    const collageW = contentW * 0.52;
    const gap = contentW * 0.06;

    drawHeartCollage(ctx, padX, bodyY, collageW, bodyH, design, imageCache, scale);

    const rightX = padX + collageW + gap;
    const rightW = contentW - collageW - gap;
    drawCalendar(ctx, rightX, bodyY + bodyH * 0.42, rightW, design, "#2a2a2a", scale);
  }

  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement, type = "image/png"): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to export canvas"));
    }, type, 1);
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
