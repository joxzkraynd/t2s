"use client"

import * as React from "react"
import { CollapsibleContent } from "@/components/ui/collapsible"

/**
 * Sidebar Component
 * Renders the studio-specific sidebar for settings and metadata.
 */
export function Sidebar() {
  return (
    <CollapsibleContent 
      side="right" 
      className="hidden w-80 border-l data-closed:hidden lg:block"
    >
      {/* Sidebar is empty as requested */}
    </CollapsibleContent>
  )
}
