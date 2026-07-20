import { getHeartCells } from "@/lib/heart-layout";
import type { DesignState, PhotoTileData, TemplateId } from "@/types";

function createEmptyTiles(): Record<string, PhotoTileData> {
  const tiles: Record<string, PhotoTileData> = {};
  for (const cell of getHeartCells()) {
    tiles[cell.id] = {
      id: cell.id,
      imageId: null,
      offsetX: 0,
      offsetY: 0,
      zoom: 1,
      rotation: 0,
      radius: 8,
      locked: false,
    };
  }
  return tiles;
}

export function createDefaultDesign(template: TemplateId): DesignState {
  const now = new Date();
  const isBlack = template === "black-anniversary";

  return {
    template,
    images: [],
    tiles: createEmptyTiles(),
    text: isBlack
      ? {
          primary: "Partner One",
          secondary: "Partner Two",
          color: "#e8c874",
          font: "great-vibes",
        }
      : {
          primary: "Happy Valentine's",
          secondary: "",
          color: "#c0304a",
          font: "great-vibes",
        },
    calendar: {
      month: now.getMonth(),
      year: now.getFullYear(),
      specialDate: now.getDate(),
      highlightStyle: isBlack ? "filled" : "outline",
      dayLabels: isBlack ? "pt" : "es",
      weekStartsMonday: false,
    },
    spotify: {
      songName: "Perfect",
      artist: "Ed Sheeran",
      url: "https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v",
      barcodeImage: null,
    },
    frame: {
      backgroundColor: isBlack ? "#0f0f0f" : "#ffffff",
      accentColor: isBlack ? "#e8c874" : "#c0304a",
      texture: "none",
      showPrintMargins: false,
    },
  };
}
