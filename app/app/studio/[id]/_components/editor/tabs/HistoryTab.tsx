"use client"

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
import { formatDistanceToNow } from "date-fns"
import { mockHistoryData } from "../../../../_data/history"

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
        {mockHistoryData.map((item) => (
          <HistoryItem
            key={item.id}
            title={item.title}
            timestamp={item.timestamp}
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
  timestamp: string
}

function HistoryItem({ title, timestamp }: HistoryItemProps) {
  // Use date-fns for robust, standard relative time formatting
  const relativeTime = formatDistanceToNow(new Date(timestamp), { addSuffix: true })

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription className="line-clamp-1">
          <time dateTime={timestamp} title={new Date(timestamp).toLocaleString()} suppressHydrationWarning>
            {relativeTime}
          </time>
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
