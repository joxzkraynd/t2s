import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Metadata } from "next"
import { ProjectGrid } from "@/components/project-grid"
import { CreateProjectDialog } from "@/components/create-project-dialog"

export const metadata: Metadata = {
  title: "Studio | T2S",
}

const projects = [
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
]

export default function Page() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <AppBreadcrumb 
            paths={[{ label: "Home", href: "/app", visibility: 'tablet' }]} 
            currentLabel="Studio" 
          />
        </div>
        <CreateProjectDialog />
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <ProjectGrid projects={projects} />
      </div>
    </>
  )
}
