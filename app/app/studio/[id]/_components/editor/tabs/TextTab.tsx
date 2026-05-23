"use client"

import { User, Mic } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { TabsContent } from "@/components/ui/tabs"
import { useSpeaker } from "../../layout/SpeakerProvider"
import { SpeakerSettingsDrawer } from "../../layout/SpeakerSettingsDrawer"

/**
 * TextTab Component
 * Renders the simplified text editor view.
 */
export function TextTab() {
  const { speaker1, setSpeaker1 } = useSpeaker()

  return (
    <TabsContent value="text" className="flex flex-1 flex-col outline-none">
      <InputGroup className="flex-1 group/input-group">
        <InputGroupTextarea
          id="textarea-text"
          placeholder="Enter your script here..."
          className="h-full min-h-0 flex-1"
        />
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
