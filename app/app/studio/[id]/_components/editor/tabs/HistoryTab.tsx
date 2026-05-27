"use client"

import { useState } from "react"
import { ChevronDownIcon, DownloadIcon, TrashIcon, History } from "lucide-react"
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { useSpeaker, HistoryItem as HistoryItemType } from "../../layout/SpeakerProvider"

/**
 * HistoryTab Component
 * Renders a list of historical speech generations.
 */
export function HistoryTab() {
  const { historyList, setActiveTab } = useSpeaker()

  return (
    <TabsContent 
      value="history" 
      className="flex flex-1 flex-col outline-none"
    >
      {historyList.length === 0 ? (
        <Empty className="border border-dashed p-4">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <History />
            </EmptyMedia>
            <EmptyTitle>History is Empty</EmptyTitle>
            <EmptyDescription>
              Generate speech audio to see your creations appear here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveTab("text")}
            >
              Create Speech
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <ItemGroup>
          {historyList.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
            />
          ))}
        </ItemGroup>
      )}
    </TabsContent>
  )
}

/**
 * HistoryItem Component
 * Encapsulates the layout and playback control for a single history entry.
 */
interface HistoryItemProps {
  item: HistoryItemType
}

function HistoryItem({ item }: HistoryItemProps) {
  const { 
    audioUrl, 
    setAudioUrl, 
    isPlaying: globalIsPlaying, 
    setIsPlaying, 
    setHistoryList 
  } = useSpeaker()

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  // Check if this history track is currently loaded and playing
  const isActive = audioUrl === item.audioUrl && item.audioUrl !== undefined
  const isPlaying = isActive && globalIsPlaying

  const relativeTime = formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })

  const handlePlayToggle = () => {
    if (!item.audioUrl) {
      toast.info(`Simulating mock track: "${item.title}" (no actual audio generated).`)
      return
    }

    if (isActive) {
      setIsPlaying(!globalIsPlaying)
    } else {
      setAudioUrl(item.audioUrl)
      setIsPlaying(true)
    }
  }

  const handleDownload = () => {
    if (!item.audioUrl) {
      toast.error("Mock tracks cannot be downloaded.")
      return
    }

    try {
      const link = document.createElement("a")
      link.href = item.audioUrl
      link.download = `t2s-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.wav`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("Download started successfully!")
    } catch (err) {
      toast.error("Failed to download audio file.")
    }
  }

  const handleDelete = () => {
    setHistoryList((prev) => prev.filter((h) => h.id !== item.id))
    if (isActive) {
      setAudioUrl(null)
    }
    toast.success("History item deleted", {
      description: `"${item.title}" has been removed.`,
    })
    setShowDeleteDialog(false)
  }

  return (
    <>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle className="font-medium">{item.title}</ItemTitle>
          <ItemDescription className="line-clamp-1">
            <time dateTime={item.timestamp} title={new Date(item.timestamp).toLocaleString()} suppressHydrationWarning>
              {relativeTime}
            </time>
          </ItemDescription>
        </ItemContent>
        
        <ItemActions>
          <ButtonGroup>
            <Button variant="outline" onClick={handlePlayToggle}>
              {isPlaying ? "Pause" : "Play"}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="More Options">
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleDownload} disabled={!item.audioUrl}>
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
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
