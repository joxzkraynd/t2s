"use client"

import { useRef, useEffect } from "react"
import { User, Mic } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { TabsContent } from "@/components/ui/tabs"
import { useSpeaker, SpeechBlock } from "../../layout/SpeakerProvider"
import { SpeakerSettingsDrawer } from "../../layout/SpeakerSettingsDrawer"
import { AudioTagAutocomplete } from "@/components/ui/audio-tag-autocomplete"

function blocksToText(blocks: SpeechBlock[]): string {
  const onlySpeaker1 = blocks.every(b => b.speaker === "Speaker 1")
  if (onlySpeaker1) {
    return blocks.map(b => b.text).join("\n")
  }
  return blocks.map(b => `${b.speaker}: ${b.text}`).join("\n")
}

function textToBlocks(text: string): SpeechBlock[] {
  if (!text.trim()) {
    return [{ id: "block-text-1", speaker: "Speaker 1", text: "" }]
  }

  const lines = text.split("\n")
  const result: SpeechBlock[] = []
  let currentSpeaker: "Speaker 1" | "Speaker 2" = "Speaker 1"
  let currentText: string[] = []
  let hasPendingSpeaker = false

  for (const line of lines) {
    const match = line.match(/^(Speaker [12]):\s*(.*)$/)
    if (match) {
      if (currentText.length > 0 || hasPendingSpeaker) {
        result.push({
          id: `block-text-${result.length}`,
          speaker: currentSpeaker,
          text: currentText.join("\n"),
        })
        currentText = []
      }
      currentSpeaker = match[1] as "Speaker 1" | "Speaker 2"
      hasPendingSpeaker = true
      if (match[2]) {
        currentText.push(match[2])
      }
    } else {
      currentText.push(line)
    }
  }

  result.push({
    id: `block-text-${result.length}`,
    speaker: currentSpeaker,
    text: currentText.join("\n"),
  })

  return result
}

export function TextTab() {
  const { blocks, setBlocks, speaker1, setSpeaker1, isGenerating } = useSpeaker()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isInternalUpdate = useRef(false)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!isInternalUpdate.current && textareaRef.current) {
      textareaRef.current.value = blocksToText(blocks)
    }
    isInternalUpdate.current = false
  }, [blocks])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    isInternalUpdate.current = true

    if (text.trim()) {
      const newBlocks = textToBlocks(text)
      const mergedBlocks = newBlocks.map((nb, i) => ({
        ...nb,
        id: blocks[i]?.id || nb.id,
      }))
      setBlocks(mergedBlocks)
    } else {
      setBlocks([{ id: "block-text-1", speaker: "Speaker 1", text: "" }])
    }
  }

  return (
    <TabsContent value="text" className="flex flex-1 flex-col outline-none">
      <InputGroup className="flex-1 group/input-group">
        <InputGroupTextarea
          id="textarea-text"
          placeholder="Enter your script here..."
          className="h-full min-h-0 flex-1"
          ref={textareaRef}
          defaultValue={blocksToText(blocks)}
          onChange={handleChange}
          disabled={isGenerating}
        />
        <AudioTagAutocomplete textareaRef={textareaRef} />
        <InputGroupAddon align="block-start" className="border-b">
          <SpeakerSettingsDrawer
            speakerName="Speaker 1"
            audioProfile={speaker1.audioProfile}
            setAudioProfile={(val) => setSpeaker1((prev) => ({ ...prev, audioProfile: val }))}
            style={speaker1.style}
            setStyle={(val) => setSpeaker1((prev) => ({ ...prev, style: val }))}
            pace={speaker1.pace}
            setPace={(val) => setSpeaker1((prev) => ({ ...prev, pace: val }))}
            accent={speaker1.accent}
            setAccent={(val) => setSpeaker1((prev) => ({ ...prev, accent: val }))}
            voice={speaker1.voice}
            setVoice={(val) => setSpeaker1((prev) => ({ ...prev, voice: val }))}
          >
            <InputGroupButton variant="outline" size="sm">
              <User />
              Speaker 1 - {speaker1.voice}
            </InputGroupButton>
          </SpeakerSettingsDrawer>
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
