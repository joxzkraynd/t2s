import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Metadata } from "next"
import { ProjectGrid } from "./_components/project-grid"
import { CreateProjectDialog } from "./_components/create-project-dialog"
import { mockProjects } from "./_data/projects"

export const metadata: Metadata = {
  title: "Studio | T2S",
}

export default function Page() {
  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 px-4 backdrop-blur-md">
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
        <ProjectGrid projects={mockProjects} />
      </div>
    </>
  )
}
