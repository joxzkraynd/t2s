"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

// Local sub-components
import { TextTab } from "./tabs/TextTab"
import { ComposerTab } from "./tabs/ComposerTab"
import { HistoryTab } from "./tabs/HistoryTab"
import { SidebarSettingsForm } from "../layout/Sidebar"
import { useSpeaker } from "../layout/SpeakerProvider"

/**
 * Editor Component
 * The main container for the text-to-speech studio editor.
 * Orchestrates different editing modes (Text, Composer, History) via Tabs.
 * Integrates responsive Settings access: inline collapsible panel on Desktop,
 * and a sliding Drawer on Mobile.
 */
export function Editor() {
  const { activeTab, setActiveTab } = useSpeaker()

  return (
    <section 
      className="flex flex-1 flex-col overflow-y-auto p-4 min-h-0 scroll-smooth" 
      aria-label="Editor"
    >
      <Drawer direction="right">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col">
          {/* Tab Headers & Global Actions */}
          <div className="flex items-center justify-between">
            <TabsList className="w-fit">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="composer">Composer</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            {/* Desktop Settings Panel Trigger */}
            <CollapsibleTrigger asChild className="max-md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                aria-label="Studio Settings"
              >
                <Settings />
              </Button>
            </CollapsibleTrigger>
            
            {/* Mobile Settings Drawer Trigger */}
            <DrawerTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                aria-label="Studio Settings"
              >
                <Settings />
              </Button>
            </DrawerTrigger>
          </div>

          {/* Tab Contents */}
          <TextTab />
          <ComposerTab />
          <HistoryTab />
        </Tabs>

        {/* Mobile Settings Drawer Content (rendered only on small screens) */}
        <DrawerContent className="h-full flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Studio Settings</DrawerTitle>
            <DrawerDescription>Configure the speech generation settings and speaker profiles.</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4 no-scrollbar">
            <SidebarSettingsForm />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </section>
  )
}
