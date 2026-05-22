"use client"

import * as React from "react"
import { ChevronDownIcon, DownloadIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from "@/components/ui/item"
import { TabsContent } from "@/components/ui/tabs"

/**
 * Data structure for history entries
 */
interface HistoryData {
  id: number
  title: string
  description: string
}

/**
 * Mock data for the Greek alphabet demonstration
 */
const HISTORY_DATA: HistoryData[] = [
  { id: 1, title: "Alpha", description: "First letter of the Greek alphabet." },
  { id: 2, title: "Beta", description: "Second letter of the Greek alphabet." },
  { id: 3, title: "Gamma", description: "Third letter of the Greek alphabet." },
  { id: 4, title: "Delta", description: "Fourth letter of the Greek alphabet." },
  { id: 5, title: "Epsilon", description: "Fifth letter of the Greek alphabet." },
  { id: 6, title: "Zeta", description: "Sixth letter of the Greek alphabet." },
  { id: 7, title: "Eta", description: "Seventh letter of the Greek alphabet." },
  { id: 8, title: "Theta", description: "Eighth letter of the Greek alphabet." },
  { id: 9, title: "Iota", description: "Ninth letter of the Greek alphabet." },
  { id: 10, title: "Kappa", description: "Tenth letter of the Greek alphabet." },
  { id: 11, title: "Lambda", description: "Eleventh letter of the Greek alphabet." },
  { id: 12, title: "Mu", description: "Twelfth letter of the Greek alphabet." },
  { id: 13, title: "Nu", description: "Thirteenth letter of the Greek alphabet." },
  { id: 14, title: "Xi", description: "Fourteenth letter of the Greek alphabet." },
  { id: 15, title: "Omicron", description: "Fifteenth letter of the Greek alphabet." },
  { id: 16, title: "Pi", description: "Sixteenth letter of the Greek alphabet." },
  { id: 17, title: "Rho", description: "Seventeenth letter of the Greek alphabet." },
  { id: 18, title: "Sigma", description: "Eighteenth letter of the Greek alphabet." },
  { id: 19, title: "Tau", description: "Nineteenth letter of the Greek alphabet." },
  { id: 20, title: "Upsilon", description: "Twentieth letter of the Greek alphabet." },
  { id: 21, title: "Phi", description: "Twenty-first letter of the Greek alphabet." },
  { id: 22, title: "Chi", description: "Twenty-second letter of the Greek alphabet." },
  { id: 23, title: "Psi", description: "Twenty-third letter of the Greek alphabet." },
  { id: 24, title: "Omega", description: "Twenty-fourth letter of the Greek alphabet." },
]

/**
 * HistoryTab Component
 * Renders a list of historical actions using shadcn Item components.
 */
export function HistoryTab() {
  return (
    <TabsContent 
      value="history" 
      className="flex flex-1 flex-col outline-none gap-4 pb-4"
    >
      <ItemGroup>
        {HISTORY_DATA.map((item) => (
          <HistoryItem
            key={item.id}
            title={item.title}
            description={item.description}
          />
        ))}
      </ItemGroup>
    </TabsContent>
  )
}

/**
 * HistoryItem Component
 * Encapsulates the layout for a single history entry, including actions.
 */
interface HistoryItemProps {
  title: string
  description: string
}

function HistoryItem({ title, description }: HistoryItemProps) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription className="line-clamp-1">
          {description}
        </ItemDescription>
      </ItemContent>
      
      <ItemActions>
        <ButtonGroup>
          {/* Main Action */}
          <Button variant="outline">
            Play
          </Button>
          
          {/* Secondary Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="More Options">
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <DownloadIcon />
                  Download
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive">
                  <TrashIcon />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </ItemActions>
    </Item>
  )
}
