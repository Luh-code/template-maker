"use client";

import { useCallback, useState } from "react";
import jsPDF from "jspdf";
import { useDesignStore } from "@/store/design-store";
import { canvasToBlob, downloadBlob, renderFrameToCanvas } from "@/lib/render-frame";

const EXPORT_WIDTH_PX = 3000; // ~10in wide at 300 DPI

/** Drives high-resolution PNG/PDF export straight from design state (no DOM screenshot). */
export function useExportDesign() {
  const [isExporting, setIsExporting] = useState<"png" | "pdf" | null>(null);

  const exportPng = useCallback(async () => {
    setIsExporting("png");
    try {
      const design = useDesignStore.getState().design;
      const canvas = await renderFrameToCanvas(design, EXPORT_WIDTH_PX);
      const blob = await canvasToBlob(canvas, "image/png");
      downloadBlob(blob, `memory-frame-${design.template}.png`);
    } finally {
      setIsExporting(null);
    }
  }, []);

  const exportPdf = useCallback(async () => {
    setIsExporting("pdf");
    try {
      const design = useDesignStore.getState().design;
      const canvas = await renderFrameToCanvas(design, EXPORT_WIDTH_PX);
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
        compress: true,
      });
      pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
      pdf.save(`memory-frame-${design.template}.pdf`);
    } finally {
      setIsExporting(null);
    }
  }, []);

  return { exportPng, exportPdf, isExporting };
}
