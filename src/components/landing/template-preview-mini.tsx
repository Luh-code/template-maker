import { HEART_MATRIX } from "@/lib/heart-layout";
import { cn } from "@/lib/utils";

/** Small static mockup of a frame used on the landing page template cards. */
export function TemplatePreviewMini({
  variant,
}: {
  variant: "black-anniversary" | "white-valentine";
}) {
  const isBlack = variant === "black-anniversary";

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col gap-3 rounded-md p-4",
        isBlack ? "bg-[#0f0f0f]" : "bg-white border border-neutral-200"
      )}
    >
      <div
        className={cn(
          "text-center font-handwritten-1 text-lg",
          isBlack ? "text-amber-300" : "text-rose-500"
        )}
      >
        {isBlack ? "Alex ❤ Sam" : "Happy Valentine's"}
      </div>
      <div className="flex flex-1 items-center gap-4">
        <div className="grid shrink-0 grid-cols-7 gap-[2px]" style={{ width: 110 }}>
          {HEART_MATRIX.flat().map((active, i) => (
            <div
              key={i}
              className={cn(
                "aspect-square rounded-[2px]",
                active
                  ? isBlack
                    ? "bg-gradient-to-br from-amber-200/70 to-amber-500/40"
                    : "bg-gradient-to-br from-rose-200 to-rose-400"
                  : "bg-transparent"
              )}
            />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-1 text-[6px] leading-tight">
          <div
            className={cn(
              "mb-1 h-3 w-16 rounded-sm",
              isBlack ? "bg-amber-300/30" : "bg-rose-300/40"
            )}
          />
          <div className="grid grid-cols-7 gap-[2px]">
            {Array.from({ length: 28 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "aspect-square rounded-[1px]",
                  isBlack ? "bg-neutral-700/60" : "bg-neutral-200"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
