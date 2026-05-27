"use client"

import { useState, useEffect, useRef } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { User, Mic, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import { TabsContent } from "@/components/ui/tabs"
import { useSpeaker, SpeechBlock } from "../../layout/SpeakerProvider"
import { SpeakerSettingsDrawer } from "../../layout/SpeakerSettingsDrawer"
import { AudioTagAutocomplete } from "@/components/ui/audio-tag-autocomplete"

export type { SpeechBlock }

/**
 * ComposerTab Component
 * Renders an interactive list of speech blocks that can be added or removed.
 */
export function ComposerTab() {
  const { blocks, setBlocks, speaker1, setSpeaker1, speaker2, setSpeaker2, isGenerating } = useSpeaker()

  const [lastAddedId, setLastAddedId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-focus and scroll when a new block is added
  useEffect(() => {
    if (!lastAddedId) return

    const timer = setTimeout(() => {
      const textarea = document.getElementById(`textarea-composer-${lastAddedId}`)
      if (textarea) {
        textarea.focus({ preventScroll: true })
      }
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
      setLastAddedId(null)
    }, 50)

    return () => clearTimeout(timer)
  }, [lastAddedId])

  const addSpeechBlock = () => {
    const lastBlock = blocks[blocks.length - 1]
    const nextSpeaker = lastBlock?.speaker === "Speaker 1" 
      ? "Speaker 2" 
      : "Speaker 1"
    
    const newId = `block-${Date.now()}`
    setBlocks([
      ...blocks,
      {
        id: newId,
        text: "",
        speaker: nextSpeaker
      }
    ])
    setLastAddedId(newId)
  }

  const deleteSpeechBlock = (id: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(block => block.id !== id))
    }
  }


  const handleTextChange = (id: string, text: string) => {
    setBlocks(blocks.map(block => block.id === id ? { ...block, text } : block))
  }

  return (
    <TabsContent value="composer" className="flex flex-col outline-none gap-4">
      {blocks.map((block) => (
        <InputGroup key={block.id} className="items-start group/input-group">
          <TextareaAutosize
            id={`textarea-composer-${block.id}`}
            data-slot="input-group-control"
            placeholder="Type your speech here..."
            minRows={3}
            value={block.text}
            onChange={(e) => handleTextChange(block.id, e.target.value)}
            className={cn(
              "flex w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
              "resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent"
            )}
          />
          <AudioTagAutocomplete textareaId={`textarea-composer-${block.id}`} />
          <InputGroupAddon align="block-start" className="border-b">
            {block.speaker === "Speaker 1" ? (
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
            ) : (
              <SpeakerSettingsDrawer
                speakerName="Speaker 2"
                audioProfile={speaker2.audioProfile}
                setAudioProfile={(val) => setSpeaker2((prev) => ({ ...prev, audioProfile: val }))}
                style={speaker2.style}
                setStyle={(val) => setSpeaker2((prev) => ({ ...prev, style: val }))}
                pace={speaker2.pace}
                setPace={(val) => setSpeaker2((prev) => ({ ...prev, pace: val }))}
                accent={speaker2.accent}
                setAccent={(val) => setSpeaker2((prev) => ({ ...prev, accent: val }))}
                voice={speaker2.voice}
                setVoice={(val) => setSpeaker2((prev) => ({ ...prev, voice: val }))}
              >
                <InputGroupButton variant="outline" size="sm">
                  <User />
                  Speaker 2 - {speaker2.voice}
                </InputGroupButton>
              </SpeakerSettingsDrawer>
            )}
            <InputGroupButton 
              variant="outline" 
              size="icon-sm" 
              className="ml-auto opacity-100 pointer-events-auto [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:pointer-events-none [@media(hover:hover)]:group-hover/input-group:opacity-100 [@media(hover:hover)]:group-hover/input-group:pointer-events-auto transition-opacity duration-150"
            >
              <Mic />
            </InputGroupButton>
            {blocks.length > 1 && (
              <InputGroupButton 
                variant="ghost" 
                size="icon-sm"
                onClick={() => deleteSpeechBlock(block.id)}
                className="opacity-100 pointer-events-auto [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:pointer-events-none [@media(hover:hover)]:group-hover/input-group:opacity-100 [@media(hover:hover)]:group-hover/input-group:pointer-events-auto transition-opacity duration-150"
              >
                <X />
              </InputGroupButton>
            )}
          </InputGroupAddon>
        </InputGroup>
      ))}
      <div ref={bottomRef} className="flex justify-center pb-4 scroll-mb-4">
        <Button variant="ghost" onClick={addSpeechBlock}>
          <Plus />
          Add speech block
        </Button>
      </div>
    </TabsContent>
  )
}
