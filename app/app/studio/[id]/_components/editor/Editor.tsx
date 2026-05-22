"use client"

import * as React from "react"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CollapsibleTrigger } from "@/components/ui/collapsible"

// Local sub-components
import { TextTab } from "./tabs/TextTab"
import { ComposerTab } from "./tabs/ComposerTab"
import { HistoryTab } from "./tabs/HistoryTab"

/**
 * Editor Component
 * The main container for the text-to-speech studio editor.
 * Orchestrates different editing modes (Text, Composer, History) via Tabs.
 */
export function Editor() {
  return (
    <section 
      className="flex flex-1 flex-col overflow-y-auto p-4 min-h-0 scroll-smooth" 
      aria-label="Editor"
    >
      <Tabs defaultValue="text" className="flex min-h-full flex-col">
        {/* Tab Headers & Global Actions */}
        <div className="flex items-center justify-between">
          <TabsList className="w-fit">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="composer">Composer</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              aria-label="Studio Settings"
            >
              <Settings />
            </Button>
          </CollapsibleTrigger>
        </div>

        {/* Tab Contents */}
        <TextTab />
        <ComposerTab />
        <HistoryTab />
      </Tabs>
    </section>
  )
}
