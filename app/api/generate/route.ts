import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { pcmToWav } from "@/lib/audio"

// Explicitly run as a dynamic API route to ensure ADC credentials are fetched fresh
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { blocks, speaker1, speaker2, scene, sampleContext } = body

    if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
      return NextResponse.json(
        { error: "Invalid request payload: 'blocks' array is required." },
        { status: 400 }
      )
    }

    // Filter non-empty blocks
    const activeBlocks = blocks.filter((b: any) => b.text && b.text.trim().length > 0)
    if (activeBlocks.length === 0) {
      return NextResponse.json(
        { error: "Please enter some speech text before generating audio." },
        { status: 400 }
      )
    }

    // Determine speakers used
    const speakersUsed = Array.from(new Set(activeBlocks.map((b: any) => b.speaker)))
    const usesSpeaker1 = speakersUsed.includes("Speaker 1")
    const usesSpeaker2 = speakersUsed.includes("Speaker 2")
    const isMultiSpeaker = usesSpeaker1 && usesSpeaker2

    // Initialize Google Gen AI with Gemini Enterprise (formerly Vertex AI)
    const ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GOOGLE_CLOUD_PROJECT || "bottle-495215",
      location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
    })

    let prompt = ""
    let generationConfig: any = {
      responseModalities: ["AUDIO"],
    }

    if (isMultiSpeaker) {
      // MULTI-SPEAKER CONFIGURATION
      const speakerConfigs = []
      if (usesSpeaker1) {
        speakerConfigs.push({
          speaker: "Speaker 1",
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: speaker1.voice || "Zephyr",
            },
          },
        })
      }
      if (usesSpeaker2) {
        speakerConfigs.push({
          speaker: "Speaker 2",
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: speaker2.voice || "Puck",
            },
          },
        })
      }

      generationConfig.speechConfig = {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: speakerConfigs,
        },
      }

      // Construct expressive prompt with formatting and directions
      let instructions = "Instructions:\n"
      if (scene && scene.trim().length > 0) {
        instructions += `- Environment/Scene: ${scene.trim()}\n`
      }
      if (sampleContext && sampleContext.trim().length > 0) {
        instructions += `- General delivery sample context: ${sampleContext.trim()}\n`
      }

      // Speaker 1 profile instructions
      const s1Directives = []
      if (speaker1.style) s1Directives.push(`speak with a ${speaker1.style} style`)
      if (speaker1.pace) s1Directives.push(`deliver at a ${speaker1.pace} pace`)
      if (speaker1.accent) s1Directives.push(`use a ${speaker1.accent} accent`)
      if (s1Directives.length > 0) {
        instructions += `- Speaker 1 personality profile: ${s1Directives.join(", ")}.\n`
      }

      // Speaker 2 profile instructions
      const s2Directives = []
      if (speaker2.style) s2Directives.push(`speak with a ${speaker2.style} style`)
      if (speaker2.pace) s2Directives.push(`deliver at a ${speaker2.pace} pace`)
      if (speaker2.accent) s2Directives.push(`use a ${speaker2.accent} accent`)
      if (s2Directives.length > 0) {
        instructions += `- Speaker 2 personality profile: ${s2Directives.join(", ")}.\n`
      }

      instructions += "\nTTS the following conversation between Speaker 1 and Speaker 2:\n"

      const conversationLines = activeBlocks.map(
        (b: any) => `${b.speaker}: ${b.text.trim()}`
      )
      prompt = `${instructions}${conversationLines.join("\n")}`
    } else {
      // SINGLE-SPEAKER CONFIGURATION
      const activeSpeakerName = usesSpeaker1 ? "Speaker 1" : "Speaker 2"
      const activeSpeakerSettings = usesSpeaker1 ? speaker1 : speaker2

      generationConfig.speechConfig = {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: activeSpeakerSettings.voice || "Zephyr",
          },
        },
      }

      // Construct single speaker instructions
      let instructions = "Instructions:\n"
      if (scene && scene.trim().length > 0) {
        instructions += `- Environment/Scene: ${scene.trim()}\n`
      }
      if (sampleContext && sampleContext.trim().length > 0) {
        instructions += `- General delivery sample context: ${sampleContext.trim()}\n`
      }

      const directives = []
      if (activeSpeakerSettings.style) directives.push(`speak in a ${activeSpeakerSettings.style} style`)
      if (activeSpeakerSettings.pace) directives.push(`deliver at a ${activeSpeakerSettings.pace} pace`)
      if (activeSpeakerSettings.accent) directives.push(`use a ${activeSpeakerSettings.accent} accent`)
      if (directives.length > 0) {
        instructions += `- Speaker profile: ${directives.join(", ")}.\n`
      }

      instructions += `\nSay:\n`
      const textConcatenation = activeBlocks.map((b: any) => b.text.trim()).join("\n\n")
      prompt = `${instructions}"${textConcatenation}"`
    }

    console.log(`[API TTS] Generating speech using model gemini-3.1-flash-tts-preview...`)
    console.log(`[API TTS] Prompt:\n`, prompt)

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      // Include the required role: "user" under Vertex AI / Gemini Enterprise protocols
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: generationConfig,
    })

    const candidate = response.candidates?.[0]
    if (!candidate) {
      return NextResponse.json(
        { error: "No output generated from Gemini TTS model." },
        { status: 500 }
      )
    }

    const part = candidate.content?.parts?.[0]
    if (!part || !part.inlineData?.data) {
      return NextResponse.json(
        { error: "Failed to extract audio content parts from model response." },
        { status: 500 }
      )
    }

    // Decode base64 PCM data from Gemini
    const pcmBase64 = part.inlineData.data
    const pcmBuffer = Buffer.from(pcmBase64, "base64")

    // Convert PCM to standard WAV (24000 Hz, 16-bit, mono)
    const wavBuffer = pcmToWav(pcmBuffer, 24000)
    const wavBase64 = wavBuffer.toString("base64")

    // Create a title summary of the generated audio
    const totalWords = activeBlocks.reduce((acc: number, b: any) => acc + b.text.split(/\s+/).length, 0)
    const firstBlockText = activeBlocks[0].text.trim()
    const summaryTitle = firstBlockText.length > 30 
      ? firstBlockText.substring(0, 30) + "..." 
      : firstBlockText

    return NextResponse.json({
      success: true,
      audioUrl: `data:audio/wav;base64,${wavBase64}`,
      title: summaryTitle,
      wordCount: totalWords,
    })
  } catch (error: any) {
    console.error("[API TTS] Generation Error:", error)
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during audio generation." },
      { status: 500 }
    )
  }
}
