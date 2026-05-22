"use client"

import * as React from "react"
import { User, Mic } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { TabsContent } from "@/components/ui/tabs"

/**
 * TextTab Component
 * Renders the simplified text editor view.
 */
export function TextTab() {
  return (
    <TabsContent value="text" className="flex flex-1 flex-col outline-none">
      <InputGroup className="flex-1 group/input-group">
        <InputGroupTextarea
          id="textarea-text"
          placeholder="Enter your script here..."
          className="h-full min-h-0 flex-1"
        />
        <InputGroupAddon align="block-start" className="border-b">
          <InputGroupButton variant="outline" size="sm">
            <User />
            Speaker 1 - Zephyr
          </InputGroupButton>
          <InputGroupButton 
            variant="outline" 
            size="icon-sm" 
            className="ml-auto opacity-100 pointer-events-auto [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:pointer-events-none [@media(hover:hover)]:group-hover/input-group:opacity-100 [@media(hover:hover)]:group-hover/input-group:pointer-events-auto transition-opacity duration-150"
          >
            <Mic />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </TabsContent>
  )
}
