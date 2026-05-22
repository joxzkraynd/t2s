"use client"

import * as React from "react"
import { Play, Pause } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Slider } from "@/components/ui/slider"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const DURATION = 154

const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = Math.floor(timeInSeconds % 60)

  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

/**
 * Controls Component
 * Provides playback, timeline, and generation controls for the studio.
 */
export function Controls() {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [isSeeking, setIsSeeking] = React.useState(false)
  const [seekValue, setSeekValue] = React.useState(0)
  const [isGenerating, setIsGenerating] = React.useState(false)

  // 1. Playback Timer Interval (Suspended during Seeking for robust State Sync)
  React.useEffect(() => {
    if (!isPlaying || isSeeking) return

    const interval: ReturnType<typeof setInterval> =
      setInterval(() => {
        setCurrentTime((prev) => prev + 1)
      }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, isSeeking])

  // 2. Playback Completion & Bounds Check
  React.useEffect(() => {
    if (currentTime >= DURATION) {
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [currentTime])

  // 3. Audio Generation Action
  const handleGenerate = React.useCallback(() => {
    setIsGenerating((prev) => {
      if (prev) return prev

      const promise = new Promise((resolve) => setTimeout(resolve, 2000))
      promise
        .then(() => {
          setIsGenerating(false)
        })
        .catch(() => {
          setIsGenerating(false)
        })

      return true
    })
  }, [])

  // Keep a ref to handleGenerate to avoid stale event listener closures on Mount
  const handleGenerateRef = React.useRef(handleGenerate)
  React.useEffect(() => {
    handleGenerateRef.current = handleGenerate
  }, [handleGenerate])

  // 4. Hybrid Keyboard Shortcuts
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
        setIsPlaying((prev) => !prev)
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
        setIsPlaying((prev) => !prev)
      }
    }

    // Register with capturing phase (true) to intercept keyboard events before textarea can consume them
    window.addEventListener("keydown", handleKeyDown, true)
    return () => window.removeEventListener("keydown", handleKeyDown, true)
  }, [])

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
                setIsPlaying((prev) => !prev)
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

        <span className="text-sm tabular-nums text-muted-foreground">
          {formatTime(isSeeking ? seekValue : currentTime)}
        </span>

        <Slider
          className="flex-1"
          aria-label="Playback progress timeline"
          value={[isSeeking ? seekValue : currentTime]}
          max={DURATION}
          step={1}
          onValueChange={(value) => {
            setIsSeeking(true)
            setSeekValue(value[0] ?? 0)
          }}
          onValueCommit={(value) => {
            setCurrentTime(value[0] ?? 0)
            setIsSeeking(false)
          }}
        />

        <span className="text-sm tabular-nums text-muted-foreground">
          {formatTime(DURATION)}
        </span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
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
