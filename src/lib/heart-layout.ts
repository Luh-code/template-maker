/**
 * Defines the heart-shaped photo collage grid.
 *
 * The grid is a simple boolean bitmap: each `true` cell is rendered as a
 * photo tile placeholder, laid out on a CSS grid. A smooth heart-shaped
 * clip-path is applied over the whole grid so the staircase edges of the
 * bitmap are cropped into a soft curve, matching the reference frames.
 */

/** 7 columns x 7 rows bitmap approximating a heart with a pointed tail. */
export const HEART_MATRIX: boolean[][] = [
  [false, true, true, false, true, true, false],
  [true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true],
  [false, true, true, true, true, true, false],
  [false, false, true, true, true, false, false],
  [false, false, false, true, false, false, false],
  [false, false, false, true, false, false, false],
];

export interface HeartCell {
  id: string;
  row: number;
  col: number;
}

/** Flat list of active (row, col) cells, in reading order, each with a stable id. */
export function getHeartCells(): HeartCell[] {
  const cells: HeartCell[] = [];
  HEART_MATRIX.forEach((rowArr, row) => {
    rowArr.forEach((active, col) => {
      if (active) cells.push({ id: `tile_${row}_${col}`, row, col });
    });
  });
  return cells;
}

export const HEART_ROWS = HEART_MATRIX.length;
export const HEART_COLS = HEART_MATRIX[0].length;
export const HEART_TILE_COUNT = getHeartCells().length;

/**
 * Parametric heart curve (Cardioid-like formula) sampled into points that
 * fill the given width x height box. Shared by the CSS clip-path (screen
 * preview) and the canvas 2D exporter (Path2D), so both draw the exact same
 * silhouette.
 */
export function getHeartPathPoints(
  width: number,
  height: number,
  samples = 80
): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    points.push([x, y]);
  }
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return points.map(([x, y]) => [
    ((x - minX) / (maxX - minX)) * width,
    ((y - minY) / (maxY - minY)) * height,
  ]);
}

/** CSS `clip-path: path(...)` string for the heart curve, in element-local px. */
export function generateHeartClipPath(width: number, height: number, samples = 80): string {
  const [first, ...rest] = getHeartPathPoints(width, height, samples);
  const d = `M ${first[0].toFixed(2)} ${first[1].toFixed(2)} ${rest
    .map(([x, y]) => `L ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ")} Z`;
  return `path('${d}')`;
}

/** Canvas Path2D of the heart curve, positioned with its top-left at (offsetX, offsetY). */
export function getHeartPath2D(
  width: number,
  height: number,
  offsetX = 0,
  offsetY = 0,
  samples = 80
): Path2D {
  const points = getHeartPathPoints(width, height, samples);
  const path = new Path2D();
  points.forEach(([x, y], i) => {
    const px = x + offsetX;
    const py = y + offsetY;
    if (i === 0) path.moveTo(px, py);
    else path.lineTo(px, py);
  });
  path.closePath();
  return path;
}
