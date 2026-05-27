"use client"

import { Button } from "@/components/ui/button"
import { useSpeaker } from "./SpeakerProvider"
import { toast } from "sonner"

/**
 * ExportButton Component
 * Renders the export action button in the studio header,
 * linked to the unified Speaker Context to download the currently generated audio track.
 */
export function ExportButton() {
  const { audioUrl } = useSpeaker()

  const handleExport = () => {
    if (!audioUrl) {
      toast.error("No generated audio found to export.", {
        description: "Please generate speech audio first before exporting.",
      })
      return
    }

    try {
      const link = document.createElement("a")
      link.href = audioUrl
      link.download = `t2s-studio-export-${Date.now()}.wav`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("Audio exported successfully!", {
        description: "Your WAV speech audio file has been downloaded.",
      })
    } catch (err) {
      toast.error("Failed to export audio file.")
    }
  }

  return (
    <Button onClick={handleExport} disabled={!audioUrl}>
      Export
    </Button>
  )
}
