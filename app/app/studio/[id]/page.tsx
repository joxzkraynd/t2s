import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Editor } from "./_components/editor/Editor"
import { Controls } from "./_components/layout/Controls"
import { Sidebar } from "./_components/layout/Sidebar"
import { Collapsible } from "@/components/ui/collapsible"

interface PageProps {
  params: Promise<{ id: string }>
}

import { getProjectById } from "../_data/projects"

// In a real app, you would fetch this from an API or database
async function getProject(id: string) {
  const project = getProjectById(id)
  
  return {
    title: project?.title || "New Project",
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const project = await getProject(id)
  
  return {
    title: `${project.title} | T2S`,
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const project = await getProject(id)

  return (
    <div className="flex h-svh w-full flex-col overflow-hidden">
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 px-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <AppBreadcrumb 
            paths={[
              { label: "Home", href: "/app", visibility: 'tablet' },
              { label: "Studio", href: "/app/studio", visibility: 'desktop' },
            ]} 
            currentLabel={project.title} 
          />
        </div>
        <Button>Export</Button>
      </header>
      
      <Collapsible defaultOpen className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <Editor />
          <Controls />
        </div>
        <Sidebar />
      </Collapsible>
    </div>
  )
}
