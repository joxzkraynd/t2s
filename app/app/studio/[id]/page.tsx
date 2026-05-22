import { Button } from "@/components/ui/button"
import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Metadata } from "next"

interface PageProps {
  params: Promise<{ id: string }>
}

// In a real app, you would fetch this from an API or database
async function getProject(id: string) {
  // Mocking project data for now
  const projects: Record<string, string> = {
    "1": "Project Alpha",
    "2": "Project Beta",
    "3": "Project Gamma",
    "4": "Project Delta",
    "5": "Project Epsilon",
  }
  
  return {
    title: projects[id] || "New Project",
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
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
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
      <div className="flex flex-1 items-center justify-center"></div>
    </>
  )
}
