/** The two frame templates the app supports. */
export type TemplateId = "black-anniversary" | "white-valentine";

/** A user-uploaded photo, stored once and referenced by any number of tiles. */
export interface UploadedImage {
  id: string;
  /** Object URL (session) or data URL (persisted to localStorage). */
  src: string;
  name: string;
  brightness: number; // 0-200, 100 = normal
  contrast: number; // 0-200, 100 = normal
  saturation: number; // 0-200, 100 = normal
}

/** One cell of the heart-shaped photo grid. */
export interface PhotoTileData {
  /** Matches the id produced by the heart layout matrix. */
  id: string;
  imageId: string | null;
  /** Pan offset as a percentage of tile size, -100..100. */
  offsetX: number;
  offsetY: number;
  /** 1 = image fitted to tile, >1 zoomed in. */
  zoom: number;
  /** Small decorative tilt, degrees. */
  rotation: number;
  /** Rounded corner radius as a percentage of the tile's min dimension (0-50). */
  radius: number;
  locked: boolean;
}

export type HighlightStyle = "filled" | "outline";
export type DayLabelStyle = "en" | "pt" | "es";

export interface CalendarSettings {
  month: number; // 0-11
  year: number;
  specialDate: number | null;
  highlightStyle: HighlightStyle;
  dayLabels: DayLabelStyle;
  weekStartsMonday: boolean;
}

export interface SpotifyData {
  songName: string;
  artist: string;
  url: string;
  /** User-supplied barcode image overriding the generated one. */
  barcodeImage: string | null;
}

export interface TextSettings {
  /** Partner name 1 (black template) or Title (white template). */
  primary: string;
  /** Partner name 2 (black template) or Subtitle (white template). */
  secondary: string;
  color: string;
  font: FontId;
}

export interface FrameStyle {
  backgroundColor: string;
  accentColor: string;
  texture: "none" | "linen" | "paper" | "grain";
  showPrintMargins: boolean;
}

/** A free-floating, user-placed text field anywhere on the frame. */
export interface TextLayerData {
  id: string;
  content: string;
  /** Center position as a percentage of the printable mat, 0-100. */
  xPercent: number;
  yPercent: number;
  /** Font size in px, authored against the same 1200px-wide reference frame as everything else. */
  fontSize: number;
  color: string;
  font: FontId;
  bold: boolean;
  rotation: number;
}

/** The full serializable state of a design, snapshotted for undo/redo. */
export interface DesignState {
  template: TemplateId;
  images: UploadedImage[];
  tiles: Record<string, PhotoTileData>;
  text: TextSettings;
  textLayers: TextLayerData[];
  calendar: CalendarSettings;
  spotify: SpotifyData;
  frame: FrameStyle;
}

export const FONT_OPTIONS = [
  { id: "great-vibes", label: "Great Vibes", className: "font-handwritten-1" },
  { id: "dancing-script", label: "Dancing Script", className: "font-handwritten-2" },
  { id: "parisienne", label: "Parisienne", className: "font-handwritten-3" },
  { id: "sacramento", label: "Sacramento", className: "font-handwritten-4" },
  { id: "sans", label: "Plain sans-serif", className: "font-sans" },
] as const;

export type FontId = (typeof FONT_OPTIONS)[number]["id"];
