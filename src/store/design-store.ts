import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createDefaultDesign } from "@/lib/default-design";
import { uid } from "@/lib/utils";
import type {
  CalendarSettings,
  DesignState,
  FrameStyle,
  PhotoTileData,
  SpotifyData,
  TemplateId,
  TextSettings,
  UploadedImage,
} from "@/types";

const HISTORY_LIMIT = 60;

interface DesignStore {
  design: DesignState;
  past: DesignState[];
  future: DesignState[];
  /** Snapshot captured at the start of a continuous drag/slider gesture. */
  interactionCheckpoint: DesignState | null;

  editorTheme: "light" | "dark";
  selectedTileId: string | null;
  fullscreenPreview: boolean;
  hasHydrated: boolean;

  // --- history-aware mutation helpers -------------------------------------
  /** Apply a discrete, one-shot change (adds a single undo step). */
  mutate: (updater: (design: DesignState) => DesignState) => void;
  /** Apply a change without touching history (used mid-gesture). */
  mutateLive: (updater: (design: DesignState) => DesignState) => void;
  beginInteraction: () => void;
  endInteraction: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // --- design actions ------------------------------------------------------
  setTemplate: (template: TemplateId) => void;
  loadDesign: (design: DesignState) => void;
  resetDesign: () => void;

  addImages: (images: UploadedImage[]) => void;
  removeImage: (imageId: string) => void;
  duplicateImage: (imageId: string) => void;
  reorderImages: (fromIndex: number, toIndex: number) => void;
  updateImageLive: (imageId: string, patch: Partial<UploadedImage>) => void;

  assignImageToTile: (tileId: string, imageId: string) => void;
  clearTile: (tileId: string) => void;
  updateTileLive: (tileId: string, patch: Partial<PhotoTileData>) => void;
  toggleTileLock: (tileId: string) => void;

  setTextLive: (patch: Partial<TextSettings>) => void;
  setCalendar: (patch: Partial<CalendarSettings>) => void;
  setSpotify: (patch: Partial<SpotifyData>) => void;
  setFrameLive: (patch: Partial<FrameStyle>) => void;

  setSelectedTile: (tileId: string | null) => void;
  toggleEditorTheme: () => void;
  setFullscreenPreview: (value: boolean) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useDesignStore = create<DesignStore>()(
  persist(
    (set, get) => ({
      design: createDefaultDesign("black-anniversary"),
      past: [],
      future: [],
      interactionCheckpoint: null,
      editorTheme: "light",
      selectedTileId: null,
      fullscreenPreview: false,
      hasHydrated: false,

      mutate: (updater) => {
        const prev = get().design;
        const next = updater(prev);
        set((s) => ({
          design: next,
          past: [...s.past, prev].slice(-HISTORY_LIMIT),
          future: [],
        }));
      },

      mutateLive: (updater) => {
        set((s) => ({ design: updater(s.design) }));
      },

      beginInteraction: () => {
        if (get().interactionCheckpoint) return;
        set({ interactionCheckpoint: get().design });
      },

      endInteraction: () => {
        const { interactionCheckpoint, design } = get();
        if (!interactionCheckpoint) return;
        if (interactionCheckpoint !== design) {
          set((s) => ({
            past: [...s.past, interactionCheckpoint].slice(-HISTORY_LIMIT),
            future: [],
            interactionCheckpoint: null,
          }));
        } else {
          set({ interactionCheckpoint: null });
        }
      },

      undo: () => {
        const { past, design, future } = get();
        if (past.length === 0) return;
        const previous = past[past.length - 1];
        set({
          past: past.slice(0, -1),
          design: previous,
          future: [design, ...future].slice(0, HISTORY_LIMIT),
        });
      },

      redo: () => {
        const { future, design, past } = get();
        if (future.length === 0) return;
        const next = future[0];
        set({
          future: future.slice(1),
          design: next,
          past: [...past, design].slice(-HISTORY_LIMIT),
        });
      },

      canUndo: () => get().past.length > 0,
      canRedo: () => get().future.length > 0,

      setTemplate: (template) => {
        get().mutate(() => createDefaultDesign(template));
        set({ past: [], future: [], selectedTileId: null });
      },

      loadDesign: (design) => {
        set({ design, past: [], future: [], selectedTileId: null });
      },

      resetDesign: () => {
        const template = get().design.template;
        set({
          design: createDefaultDesign(template),
          past: [],
          future: [],
          selectedTileId: null,
        });
      },

      addImages: (images) => {
        get().mutate((d) => ({ ...d, images: [...d.images, ...images] }));
      },

      removeImage: (imageId) => {
        get().mutate((d) => ({
          ...d,
          images: d.images.filter((img) => img.id !== imageId),
          tiles: Object.fromEntries(
            Object.entries(d.tiles).map(([id, tile]) => [
              id,
              tile.imageId === imageId ? { ...tile, imageId: null } : tile,
            ])
          ),
        }));
      },

      duplicateImage: (imageId) => {
        get().mutate((d) => {
          const original = d.images.find((img) => img.id === imageId);
          if (!original) return d;
          const copy: UploadedImage = { ...original, id: uid("img") };
          const index = d.images.findIndex((img) => img.id === imageId);
          const images = [...d.images];
          images.splice(index + 1, 0, copy);
          return { ...d, images };
        });
      },

      reorderImages: (fromIndex, toIndex) => {
        get().mutate((d) => {
          const images = [...d.images];
          const [moved] = images.splice(fromIndex, 1);
          images.splice(toIndex, 0, moved);
          return { ...d, images };
        });
      },

      updateImageLive: (imageId, patch) => {
        get().mutateLive((d) => ({
          ...d,
          images: d.images.map((img) =>
            img.id === imageId ? { ...img, ...patch } : img
          ),
        }));
      },

      assignImageToTile: (tileId, imageId) => {
        get().mutate((d) => ({
          ...d,
          tiles: {
            ...d.tiles,
            [tileId]: {
              ...d.tiles[tileId],
              imageId,
              offsetX: 0,
              offsetY: 0,
              zoom: 1,
            },
          },
        }));
      },

      clearTile: (tileId) => {
        get().mutate((d) => ({
          ...d,
          tiles: {
            ...d.tiles,
            [tileId]: { ...d.tiles[tileId], imageId: null, offsetX: 0, offsetY: 0, zoom: 1 },
          },
        }));
      },

      updateTileLive: (tileId, patch) => {
        get().mutateLive((d) => ({
          ...d,
          tiles: { ...d.tiles, [tileId]: { ...d.tiles[tileId], ...patch } },
        }));
      },

      toggleTileLock: (tileId) => {
        get().mutate((d) => ({
          ...d,
          tiles: {
            ...d.tiles,
            [tileId]: { ...d.tiles[tileId], locked: !d.tiles[tileId].locked },
          },
        }));
      },

      setTextLive: (patch) => {
        get().mutateLive((d) => ({ ...d, text: { ...d.text, ...patch } }));
      },

      setCalendar: (patch) => {
        get().mutate((d) => ({ ...d, calendar: { ...d.calendar, ...patch } }));
      },

      setSpotify: (patch) => {
        get().mutate((d) => ({ ...d, spotify: { ...d.spotify, ...patch } }));
      },

      setFrameLive: (patch) => {
        get().mutateLive((d) => ({ ...d, frame: { ...d.frame, ...patch } }));
      },

      setSelectedTile: (tileId) => set({ selectedTileId: tileId }),
      toggleEditorTheme: () =>
        set((s) => ({ editorTheme: s.editorTheme === "light" ? "dark" : "light" })),
      setFullscreenPreview: (value) => set({ fullscreenPreview: value }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "memory-frame-designer:design",
      partialize: (s) => ({ design: s.design, editorTheme: s.editorTheme }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
