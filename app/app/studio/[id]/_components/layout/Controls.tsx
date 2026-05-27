"use client"

import * as React from "react"
import { Play, Pause } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Slider } from "@/components/ui/slider"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSpeaker } from "./SpeakerProvider"

const formatTime = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds) || !isFinite(timeInSeconds)) return "0:00"
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = Math.floor(timeInSeconds % 60)

  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

/**
 * Controls Component
 * Provides playback, timeline, and generation controls for the studio,
 * linked directly to the unified Audio playback provider.
 */
export function Controls() {
  const {
    isPlaying,
    setIsPlaying,
    currentTime,
    duration,
    handleSeek,
    isGenerating,
    generateAudio,
    blocks,
  } = useSpeaker()

  const [isSeeking, setIsSeeking] = React.useState(false)
  const [seekValue, setSeekValue] = React.useState(0)
  const hasText = blocks.some(b => b.text.trim().length > 0)

  // Audio Generation Action
  const handleGenerate = React.useCallback(async () => {
    if (isGenerating) return

    try {
      await generateAudio()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed")
    }
  }, [isGenerating, generateAudio])

  // Keep a ref to handleGenerate to avoid stale event listener closures on Mount
  const handleGenerateRef = React.useRef(handleGenerate)
  React.useEffect(() => {
    handleGenerateRef.current = handleGenerate
  }, [handleGenerate])

  // Hybrid Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isSpace = event.code === "Space" || event.key === " " || event.key === "Spacebar"
      const isCtrlOrCmdSpace = (event.ctrlKey || event.metaKey) && isSpace
      const isPureSpace = isSpace && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey

      const isEnter = event.code === "Enter" || event.key === "Enter"
      const isCtrlOrCmdEnter = (event.ctrlKey || event.metaKey) && isEnter

      if (isCtrlOrCmdEnter) {
        event.preventDefault()
        event.stopPropagation()
        handleGenerateRef.current()
        return
      }

      if (isCtrlOrCmdSpace) {
        event.preventDefault()
        event.stopPropagation()
        setIsPlaying(!isPlaying)
        return
      }

      if (isPureSpace) {
        const active = document.activeElement
        if (
          active &&
          (active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            active.getAttribute("contenteditable") === "true")
        ) {
          return
        }
        event.preventDefault()
        event.stopPropagation()
        setIsPlaying(!isPlaying)
      }
    }

    // Register with capturing phase (true) to intercept keyboard events before textarea can consume them
    window.addEventListener("keydown", handleKeyDown, true)
    return () => window.removeEventListener("keydown", handleKeyDown, true)
  }, [isPlaying, setIsPlaying])

  return (
    <section
      className="border-t p-4"
      aria-label="Studio controls"
    >
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setIsPlaying(!isPlaying)
              }
              aria-label={
                isPlaying ? "Pause audio" : "Play audio"
              }
            >
              {isPlaying ? (
                <Pause className="fill-current" />
              ) : (
                <Play className="fill-current" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isPlaying ? "Pause" : "Play"}{" "}
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>Space</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>

        <span className="text-sm tabular-nums text-muted-foreground min-w-[32px]">
          {formatTime(isSeeking ? seekValue : currentTime)}
        </span>

        <Slider
          className="flex-1 cursor-pointer"
          aria-label="Playback progress timeline"
          value={[isSeeking ? seekValue : currentTime]}
          max={duration || 100} // Fallback to 100 during init
          step={0.1}
          onValueChange={(value) => {
            setIsSeeking(true)
            setSeekValue(value[0] ?? 0)
          }}
          onValueCommit={(value) => {
            handleSeek(value[0] ?? 0)
            setIsSeeking(false)
          }}
        />

        <span className="text-sm tabular-nums text-muted-foreground min-w-[32px]">
          {formatTime(duration)}
        </span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !hasText}
            >
              {isGenerating ? (
                <>
                  <Spinner />
                  Generating
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Generate audio{" "}
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>Enter</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </div>
    </section>
  )
}
