"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings2Icon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field"
import { GEMINI_VOICES } from "@/data/voices"

interface SpeakerSettingsDrawerProps {
  speakerName: string
  audioProfile: string
  setAudioProfile: (val: string) => void
  style: string
  setStyle: (val: string) => void
  pace: string
  setPace: (val: string) => void
  accent: string
  setAccent: (val: string) => void
  voice: string
  setVoice: (val: string) => void
  children?: React.ReactNode
}

export function SpeakerSettingsDrawer({
  speakerName,
  audioProfile,
  setAudioProfile,
  style,
  setStyle,
  pace,
  setPace,
  accent,
  setAccent,
  voice,
  setVoice,
  children,
}: SpeakerSettingsDrawerProps) {
  // Convert standard ID strings safely for semantic htmlFor/id matching
  const inputIdPrefix = speakerName.toLowerCase().replace(/\s+/g, "-")

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline" size="icon" aria-label={`${speakerName} Settings`}>
            <Settings2Icon />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <DrawerHeader>
          <DrawerTitle>{speakerName} Settings</DrawerTitle>
          <DrawerDescription>Configure voice characteristics, style parameters, and foundations for this speaker.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-4 no-scrollbar">
          <FieldGroup>
            {/* Section 1: Audio Profile */}
            <FieldSet>
              <FieldLegend>Voice Profile</FieldLegend>
              <FieldDescription>Describe the personality, tone, or character of the voice.</FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor={`${inputIdPrefix}-audio-profile`}>Audio Profile</FieldLabel>
                  <Input
                    id={`${inputIdPrefix}-audio-profile`}
                    value={audioProfile}
                    onChange={(e) => setAudioProfile(e.target.value)}
                    placeholder="e.g., Energetic teenager, clear voice"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            {/* Section 2: Style, Pace, Accent */}
            <FieldSet>
              <FieldLegend>Speech Directives</FieldLegend>
              <FieldDescription>Provide advanced stylistic cues to guide the speech generator's pacing, accent, and style.</FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor={`${inputIdPrefix}-style`}>Style</FieldLabel>
                  <Input
                    id={`${inputIdPrefix}-style`}
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    placeholder="e.g., whisper, excited, gravelly"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`${inputIdPrefix}-pace`}>Pace</FieldLabel>
                  <Input
                    id={`${inputIdPrefix}-pace`}
                    value={pace}
                    onChange={(e) => setPace(e.target.value)}
                    placeholder="e.g., natural, slightly fast, relaxed"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`${inputIdPrefix}-accent`}>Accent</FieldLabel>
                  <Input
                    id={`${inputIdPrefix}-accent`}
                    value={accent}
                    onChange={(e) => setAccent(e.target.value)}
                    placeholder="e.g., British, heavy French drawl"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            {/* Section 3: Voice Selection */}
            <FieldSet>
              <FieldLegend>Base Voice</FieldLegend>
              <FieldDescription>Select the prebuilt voice template as the foundation for this speaker.</FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor={`${inputIdPrefix}-voice`}>Voice</FieldLabel>
                  <Select value={voice} onValueChange={setVoice}>
                    <SelectTrigger id={`${inputIdPrefix}-voice`}>
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Voices</SelectLabel>
                        {GEMINI_VOICES.map((v) => (
                          <SelectItem key={v.value} value={v.value}>
                            {v.label} ({v.personality})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
