"use client"

import { CollapsibleContent } from "@/components/ui/collapsible"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemGroup,
} from "@/components/ui/item"
import { RotateCcw } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SpeakerSettingsDrawer } from "./SpeakerSettingsDrawer"
import { GEMINI_VOICES } from "@/data/voices"
import { useSpeaker } from "./SpeakerProvider"

/**
 * Sidebar Component
 * Renders the studio-specific sidebar for settings and metadata.
 */
export function Sidebar() {
  const {
    model,
    setModel,
    scene,
    setScene,
    sampleContext,
    setSampleContext,
    speaker1,
    setSpeaker1,
    speaker2,
    setSpeaker2,
    blocks,
    handleReset,
  } = useSpeaker()

  const item1VoiceObj = GEMINI_VOICES.find((v) => v.value === speaker1.voice)
  const item2VoiceObj = GEMINI_VOICES.find((v) => v.value === speaker2.voice)

  const hasSpeaker1 = blocks.some((b) => b.speaker === "Speaker 1")
  const hasSpeaker2 = blocks.some((b) => b.speaker === "Speaker 2")

  return (
    <CollapsibleContent asChild>
      <aside
        aria-label="Studio Settings"
        className="w-80 shrink-0 border-l bg-background p-4 overflow-y-auto data-[state=closed]:hidden max-md:hidden"
      >
        <FieldGroup>
          {/* Section 1: Settings (Model Selection) */}
          <FieldSet>
            <FieldLegend>Settings</FieldLegend>
            <FieldDescription>Configure the speech generation settings.</FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="model">Model</FieldLabel>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Models</SelectLabel>
                      <SelectItem value="gemini-3.1-flash-tts-preview">
                        Gemini 3.1 Flash TTS Preview
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          {/* Section 2: Advanced Settings (Scene & Sample Context) */}
          <FieldSet>
            <FieldLegend>Advanced Settings</FieldLegend>
            <FieldDescription>Speech-to-speech prompting directives.</FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="scene">Scene</FieldLabel>
                <Input
                  id="scene"
                  value={scene}
                  onChange={(e) => setScene(e.target.value)}
                  placeholder="e.g., in a busy coffee shop, cave with echo"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="sample-context">Sample Context</FieldLabel>
                <Input
                  id="sample-context"
                  value={sampleContext}
                  onChange={(e) => setSampleContext(e.target.value)}
                  placeholder="e.g., [sighs] I'm so tired..."
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          {/* Section 3: Action Items */}
          <FieldSet>
            <FieldLegend>Action Item</FieldLegend>
            <FieldDescription>Template item with an action button.</FieldDescription>
            <FieldGroup>
              <ItemGroup>
                {/* Item 1 */}
                {hasSpeaker1 && (
                  <Item variant="muted">
                    <ItemContent>
                      <ItemTitle>Speaker 1 - {speaker1.voice}</ItemTitle>
                      <ItemDescription>{item1VoiceObj?.personality || "Upbeat"}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
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
                      />
                    </ItemActions>
                  </Item>
                )}

                {/* Item 2 */}
                {hasSpeaker2 && (
                  <Item variant="muted">
                    <ItemContent>
                      <ItemTitle>Speaker 2 - {speaker2.voice}</ItemTitle>
                      <ItemDescription>{item2VoiceObj?.personality || "Upbeat"}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
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
                      />
                    </ItemActions>
                  </Item>
                )}
              </ItemGroup>
            </FieldGroup>
          </FieldSet>

          {/* Reset Button */}
          <Button variant="ghost" onClick={handleReset} className="self-end">
            <RotateCcw />
            Reset default settings
          </Button>
        </FieldGroup>
      </aside>
    </CollapsibleContent>
  )
}
