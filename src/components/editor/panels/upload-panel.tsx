"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { useDesignStore } from "@/store/design-store";
import { fileToResizedDataUrl } from "@/lib/image-utils";
import { uid } from "@/lib/utils";
import type { UploadedImage } from "@/types";

const MAX_IMAGES = 30;
const MIN_RECOMMENDED = 5;

export function UploadPanel() {
  const images = useDesignStore((s) => s.design.images);
  const addImages = useDesignStore((s) => s.addImages);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) return;
      const files = acceptedFiles.slice(0, remaining);
      const newImages: UploadedImage[] = await Promise.all(
        files.map(async (file) => ({
          id: uid("img"),
          src: await fileToResizedDataUrl(file),
          name: file.name,
          brightness: 100,
          contrast: 100,
          saturation: 100,
        }))
      );
      addImages(newImages);
    },
    [images.length, addImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    disabled: images.length >= MAX_IMAGES,
  });

  return (
    <div className="flex flex-col gap-3">
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
          isDragActive
            ? "border-amber-400 bg-amber-50"
            : "border-neutral-300 hover:border-neutral-400"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-8 w-8 text-neutral-400" />
        <p className="text-sm font-medium text-neutral-700">
          Drag & drop photos here
        </p>
        <p className="text-xs text-neutral-400">or click to browse files</p>
      </div>

      <p className="text-center text-xs text-neutral-500">
        {images.length}/{MAX_IMAGES} photos
        {images.length < MIN_RECOMMENDED &&
          ` — add at least ${MIN_RECOMMENDED} for a full heart`}
      </p>
    </div>
  );
}
