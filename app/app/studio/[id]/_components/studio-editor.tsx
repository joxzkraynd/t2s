"use client"

import * as React from "react"
import TextareaAutosize from "react-textarea-autosize"
import { Mic, User, Plus, X, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CollapsibleTrigger } from "@/components/ui/collapsible"

interface SpeechBlock {
  id: string
  text: string
  speaker: "Speaker 1 - Zephyr" | "Speaker 2 - Puck"
}

export function StudioEditor() {
  const [blocks, setBlocks] = React.useState<SpeechBlock[]>([
    { id: "block-1", text: "", speaker: "Speaker 1 - Zephyr" }
  ])

  const [lastAddedId, setLastAddedId] = React.useState<string | null>(null)
  const bottomRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
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
    const nextSpeaker = lastBlock?.speaker === "Speaker 1 - Zephyr" 
      ? "Speaker 2 - Puck" 
      : "Speaker 1 - Zephyr"
    
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
    <section 
      className="flex flex-1 flex-col overflow-y-auto p-4 min-h-0 scroll-smooth" 
      aria-label="Editor"
    >
      <Tabs defaultValue="text" className="flex min-h-full flex-col">
        <div className="flex items-center justify-between">
          <TabsList className="w-fit">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="composer">Composer</TabsTrigger>
          </TabsList>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
            >
              <Settings />
            </Button>
          </CollapsibleTrigger>
        </div>

        <TabsContent value="text" className="flex flex-1 flex-col outline-none">
          <InputGroup className="flex-1 group/input-group">
            <InputGroupTextarea
              id="textarea-text"
              placeholder="console.log('Hello, world!');"
              className="h-full min-h-0 flex-1"
            />
            <InputGroupAddon align="block-start" className="border-b">
              <InputGroupButton variant="outline" size="sm">
                <User />
                Speaker 1 - Zephyr
              </InputGroupButton>
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
              <InputGroupAddon align="block-start" className="border-b">
                <InputGroupButton 
                  variant="outline" 
                  size="sm"
                >
                  <User />
                  {block.speaker}
                </InputGroupButton>
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
      </Tabs>
    </section>
  )
}
