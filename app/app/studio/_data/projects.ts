export interface Project {
  id: string
  title: string
  description: string
}

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Project Alpha",
    description: "A high-performance text-to-speech engine with low latency and natural prosody.",
  },
  {
    id: "2",
    title: "Project Beta",
    description: "Multi-language support for voice synthesis in over 50 languages and dialects.",
  },
  {
    id: "3",
    title: "Project Gamma",
    description: "Custom voice cloning technology for creating personalized and unique experiences.",
  },
  {
    id: "4",
    title: "Project Delta",
    description: "Real-time emotional modulation for expressive and human-like speech synthesis.",
  },
  {
    id: "5",
    title: "Project Epsilon",
    description: "Advanced noise cancellation and audio enhancement for crystal clear voice output.",
  },
  {
    id: "6",
    title: "Project Zeta",
    description: "Interactive dialogue system for dynamic NPC conversations and role-playing scenarios.",
  },
  {
    id: "7",
    title: "Project Eta",
    description: "Podcast voiceover automation with automated paragraph-level pacing and tone shifts.",
  },
  {
    id: "8",
    title: "Project Theta",
    description: "Neural voice restoration for historical recordings and degraded audio assets.",
  },
  {
    id: "9",
    title: "Project Iota",
    description: "Ultra-compact embedded TTS model optimized for low-power IoT devices and smart wearables.",
  },
  {
    id: "10",
    title: "Project Kappa",
    description: "Real-time speech-to-speech translation with accent preservation across language barriers.",
  },
  {
    id: "11",
    title: "Project Lambda",
    description: "Serverless scalable audio generation API with sub-100ms time-to-first-byte.",
  },
  {
    id: "12",
    title: "Project Mu",
    description: "Dynamic musical integration that automatically blends synthesized speech with background scores.",
  },
  {
    id: "13",
    title: "Project Nu",
    description: "Non-verbal sound generator incorporating natural breaths, laughs, and sighs into speech.",
  },
  {
    id: "14",
    title: "Project Xi",
    description: "Multi-modal presentation sync aligning speech generation with slides and visual elements.",
  },
  {
    id: "15",
    title: "Project Omicron",
    description: "Adaptive pronunciation lexicon editor with automatic phonetic alphabet matching.",
  },
  {
    id: "16",
    title: "Project Pi",
    description: "Mathematical and technical notation speaker optimized for educational and scientific content.",
  },
  {
    id: "17",
    title: "Project Rho",
    description: "Intelligent audio watermark injector for secure licensing and copyright protection.",
  },
  {
    id: "18",
    title: "Project Sigma",
    description: "Stereo spatial audio panner simulating immersive 3D listening environments.",
  },
  {
    id: "19",
    title: "Project Tau",
    description: "Automatic script formatting and conversational pacing analyzer for long-form audiobooks.",
  },
  {
    id: "20",
    title: "Project Upsilon",
    description: "Whisper-quiet ultra-low bit rate audio codec for high-fidelity communication over poor networks.",
  },
  {
    id: "21",
    title: "Project Phi",
    description: "Voice biomarker analyzer identifying fatigue and engagement levels in real-time.",
  },
  {
    id: "22",
    title: "Project Chi",
    description: "Hyper-realistic voice changer with instant voice conversion for gaming and live streaming.",
  },
  {
    id: "23",
    title: "Project Psi",
    description: "Psychological tone matching that adapts pacing and empathy levels based on conversational context.",
  },
  {
    id: "24",
    title: "Project Omega",
    description: "The ultimate synthesis sandbox combining all neural architectures into a single workspace.",
  },
]

export function getProjectById(id: string): Project | undefined {
  return mockProjects.find((p) => p.id === id)
}
