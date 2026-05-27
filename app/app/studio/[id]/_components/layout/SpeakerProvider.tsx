"use client"

import { createContext, useState, useEffect, useRef, use, Dispatch, SetStateAction } from "react"

export interface Speaker {
  audioProfile: string
  style: string
  pace: string
  accent: string
  voice: string
}

export interface SpeechBlock {
  id: string
  text: string
  speaker: "Speaker 1" | "Speaker 2"
}

export interface HistoryItem {
  id: string | number
  title: string
  timestamp: string
  audioUrl?: string
}

interface SpeakerState {
  model: string
  setModel: (val: string) => void
  scene: string
  setScene: (val: string) => void
  sampleContext: string
  setSampleContext: (val: string) => void
  
  speaker1: Speaker
  setSpeaker1: Dispatch<SetStateAction<Speaker>>
  speaker2: Speaker
  setSpeaker2: Dispatch<SetStateAction<Speaker>>
  
  blocks: SpeechBlock[]
  setBlocks: Dispatch<SetStateAction<SpeechBlock[]>>
  
  handleReset: () => void

  // Audio Playback Engine States
  audioUrl: string | null
  setAudioUrl: (val: string | null) => void
  isPlaying: boolean
  setIsPlaying: (val: boolean) => void
  currentTime: number
  setCurrentTime: (val: number) => void
  duration: number
  setDuration: (val: number) => void
  handleSeek: (val: number) => void

  // Generation States & Handlers
  isGenerating: boolean
  generateAudio: () => Promise<any>

  // History Tab States
  historyList: HistoryItem[]
  setHistoryList: Dispatch<SetStateAction<HistoryItem[]>>

  // Active Tab States
  activeTab: string
  setActiveTab: (val: string) => void
}

const SpeakerContext = createContext<SpeakerState | null>(null)

/**
 * SpeakerProvider
 * A central React Context Provider managing studio state, unified HTML5 Audio playback,
 * background API generation tasks, and history item lifecycle events.
 */
export function SpeakerProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState("gemini-3.1-flash-tts-preview")
  const [scene, setScene] = useState("")
  const [sampleContext, setSampleContext] = useState("")

  const [speaker1, setSpeaker1] = useState<Speaker>({
    audioProfile: "",
    style: "",
    pace: "",
    accent: "",
    voice: "Zephyr", // Default voice for Speaker 1 as requested
  })

  const [speaker2, setSpeaker2] = useState<Speaker>({
    audioProfile: "",
    style: "",
    pace: "",
    accent: "",
    voice: "Puck", // Default voice for Speaker 2 as requested
  })

  const [blocks, setBlocks] = useState<SpeechBlock[]>([
    { id: "block-1", text: "", speaker: "Speaker 1" }
  ])

  // Audio Playback Engine States
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Generation & History States
  const [isGenerating, setIsGenerating] = useState(false)
  const [historyList, setHistoryList] = useState<HistoryItem[]>([])
  const [activeTab, setActiveTab] = useState("text")

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 1. Initialize client-side Audio element
  useEffect(() => {
    if (typeof window === "undefined") return
    const audio = new Audio()
    audioRef.current = audio

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const onDurationChange = () => {
      setDuration(audio.duration || 0)
    }

    const onEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("durationchange", onDurationChange)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("durationchange", onDurationChange)
      audio.removeEventListener("ended", onEnded)
      audio.pause()
    }
  }, [])

  // 2. Sync audioUrl & isPlaying to Audio instance
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!audioUrl) {
      audio.removeAttribute("src")
      setIsPlaying(false)
      setCurrentTime(0)
      setDuration(0)
      return
    }

    if (audio.src !== audioUrl) {
      audio.src = audioUrl
    }

    if (isPlaying) {
      audio.play().catch((err) => {
        console.error("Audio playback error:", err)
        setIsPlaying(false)
      })
    } else {
      audio.pause()
    }
  }, [isPlaying, audioUrl])

  // 4. Handle user scrubbing/seeking
  const handleSeek = (newTime: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  // 5. Invoke Vertex AI TTS dynamic endpoint
  const generateAudio = async () => {
    if (isGenerating) return
    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blocks,
          speaker1,
          speaker2,
          scene,
          sampleContext,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Audio speech synthesis failed.")
      }

      // Add to dynamic history
      const newHistoryItem: HistoryItem = {
        id: `gen-${Date.now()}`,
        title: data.title || "Generated speech",
        timestamp: new Date().toISOString(),
        audioUrl: data.audioUrl,
      }

      setHistoryList((prev) => [newHistoryItem, ...prev])

      // Auto-load and play
      setAudioUrl(data.audioUrl)
      setIsPlaying(true)

      return data
    } catch (err: any) {
      console.error("[SpeakerProvider] generateAudio error:", err)
      throw err
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setModel("gemini-3.1-flash-tts-preview")
    setScene("")
    setSampleContext("")
    setSpeaker1({
      audioProfile: "",
      style: "",
      pace: "",
      accent: "",
      voice: "Zephyr",
    })
    setSpeaker2({
      audioProfile: "",
      style: "",
      pace: "",
      accent: "",
      voice: "Puck",
    })
    setBlocks([
      { id: "block-1", text: "", speaker: "Speaker 1" }
    ])
    setAudioUrl(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }

  return (
    <SpeakerContext
      value={{
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
        setBlocks,
        handleReset,

        // Audio Playback
        audioUrl,
        setAudioUrl,
        isPlaying,
        setIsPlaying,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        handleSeek,

        // Generation
        isGenerating,
        generateAudio,

        // History list
        historyList,
        setHistoryList,

        // Active Tab
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </SpeakerContext>
  )
}

/**
 * Custom Hook: useSpeaker
 * Provides access to the Speaker Context. Guarantees safety by checking for provider presence.
 */
export function useSpeaker() {
  const context = use(SpeakerContext)
  if (!context) {
    throw new Error("useSpeaker must be used within a SpeakerProvider")
  }
  return context
}

