import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";
import { TemplatePreviewMini } from "@/components/landing/template-preview-mini";

const TEMPLATES = [
  {
    id: "black-anniversary" as const,
    name: "Black Anniversary",
    description:
      "Black background, gold handwritten names, a heart photo collage, Spotify music code, and a highlighted anniversary date.",
  },
  {
    id: "white-valentine" as const,
    name: "White Valentine's",
    description:
      "Minimal white background, a heart photo collage, a bold title, and a clean calendar with a highlighted date.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-neutral-50">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 sm:px-10">
        <div className="flex items-center gap-2 font-semibold text-neutral-900">
          <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
          Memory Frame Designer
        </div>
        <div className="hidden items-center gap-1 text-sm text-neutral-500 sm:flex">
          <Sparkles className="h-4 w-4" />
          Print-ready in minutes
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-6 py-14 sm:px-10">
        <h1 className="text-center text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          Design a frame worth framing
        </h1>
        <p className="mt-3 max-w-xl text-center text-neutral-500">
          Choose a template, upload your favorite photos, and customize every
          detail — names, calendar, and music — before exporting a
          print-quality PNG or PDF.
        </p>

        <div className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          {TEMPLATES.map((template) => (
            <Link
              key={template.id}
              href={`/editor/${template.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="aspect-[4/3] w-full border-b border-neutral-200 bg-neutral-100 p-3">
                <TemplatePreviewMini variant={template.id} />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {template.name}
                </h2>
                <p className="text-sm text-neutral-500">{template.description}</p>
                <span className="mt-auto pt-3 text-sm font-medium text-rose-500 group-hover:underline">
                  Start designing &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t border-neutral-200 bg-white px-6 py-4 text-center text-xs text-neutral-400 sm:px-10">
        Designs are saved automatically to this browser as you work.
      </footer>
    </div>
  );
}
