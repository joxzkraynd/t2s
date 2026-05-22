"use client"

import { useState } from "react"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
import { toast } from "sonner"
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  // Use date-fns for robust, standard relative time formatting
  const relativeTime = formatDistanceToNow(new Date(timestamp), { addSuffix: true })

  return (
    <>
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
                  <DropdownMenuItem 
                    variant="destructive"
                    onSelect={() => setShowDeleteDialog(true)}
                  >
                    <TrashIcon />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </ItemActions>
      </Item>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              history record and all of its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                toast.success("History item deleted", {
                  description: `"${title}" has been removed.`,
                  action: {
                    label: "Undo",
                    onClick: () => console.log("Undo delete history"),
                  },
                })
                setShowDeleteDialog(false)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
