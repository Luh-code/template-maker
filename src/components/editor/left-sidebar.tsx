"use client";

import { useDesignStore } from "@/store/design-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LeftPanelTab } from "@/store/design-store";
import { UploadPanel } from "./panels/upload-panel";
import { CalendarPanel } from "./panels/calendar-panel";
import { TextPanel } from "./panels/text-panel";
import { SpotifyPanel } from "./panels/spotify-panel";
import { StylePanel } from "./panels/style-panel";

export function LeftSidebar() {
  const template = useDesignStore((s) => s.design.template);
  const leftPanelTab = useDesignStore((s) => s.leftPanelTab);
  const setLeftPanelTab = useDesignStore((s) => s.setLeftPanelTab);
  const isBlack = template === "black-anniversary";

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 thin-scrollbar">
      <Tabs
        value={leftPanelTab}
        onValueChange={(v) => setLeftPanelTab(v as LeftPanelTab)}
        className="flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-3 gap-1 h-auto">
          <TabsTrigger value="upload">Photos</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsList className="mt-1 grid w-full grid-cols-2 gap-1 h-auto">
          {isBlack && <TabsTrigger value="spotify">Spotify</TabsTrigger>}
          <TabsTrigger value="style" className={isBlack ? "" : "col-span-2"}>
            Frame Style
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <UploadPanel />
        </TabsContent>
        <TabsContent value="text">
          <TextPanel />
        </TabsContent>
        <TabsContent value="calendar">
          <CalendarPanel />
        </TabsContent>
        {isBlack && (
          <TabsContent value="spotify">
            <SpotifyPanel />
          </TabsContent>
        )}
        <TabsContent value="style">
          <StylePanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
