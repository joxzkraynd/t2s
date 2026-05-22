import { Button } from "@/components/ui/button"
import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Metadata } from "next"
import { Mic, User, PanelRight } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

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
      <Collapsible defaultOpen className="flex flex-1 overflow-hidden">
        {/* Kolom Kiri (Editor + Controls) */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Section 1: Editor */}
          <section 
            className="flex flex-1 flex-col p-4" 
            aria-label="Editor"
          >
            <Tabs defaultValue="text" className="flex h-full flex-col">
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
                    <PanelRight />
                  </Button>
                </CollapsibleTrigger>
              </div>

              <TabsContent value="text" className="flex flex-1 flex-col outline-none">
                <InputGroup className="flex-1">
                  <InputGroupTextarea
                    id="textarea-text"
                    placeholder="Masukkan teks di sini..."
                    className="h-full min-h-0 flex-1"
                  />
                  <InputGroupAddon align="block-start" className="border-b">
                    <InputGroupButton variant="outline" size="sm">
                      <User />
                      Speaker 1 - Zephyr
                    </InputGroupButton>
                    <InputGroupButton variant="outline" size="icon-sm" className="ml-auto">
                      <Mic />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </TabsContent>

              <TabsContent value="composer" className="flex flex-1 flex-col outline-none">
                <InputGroup className="flex-1">
                  <InputGroupTextarea
                    id="textarea-composer"
                    placeholder="Masukkan teks di sini..."
                    className="h-full min-h-0 flex-1"
                  />
                  <InputGroupAddon align="block-start" className="border-b">
                    <InputGroupButton variant="outline" size="sm">
                      <User />
                      Speaker 1 - Zephyr
                    </InputGroupButton>
                    <InputGroupButton variant="outline" size="icon-sm" className="ml-auto">
                      <Mic />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </TabsContent>
            </Tabs>
          </section>

          {/* Section 2: Controls & Results */}
          <section 
            className="border-t p-4" 
            aria-label="Controls"
          >
            <div className="flex flex-col gap-4">
              {/* Tempat untuk Audio Player nanti */}
              <div className="flex justify-end">
                <Button>Generate</Button>
              </div>
            </div>
          </section>
        </div>

        {/* Settings/Config (Kanan) */}
        <CollapsibleContent 
          className="hidden h-full border-l lg:data-[state=open]:block"
        >
          <aside 
            className="w-80 h-full overflow-y-auto" 
            aria-label="Project settings"
          >
            {/* Konten Settings di sini */}
          </aside>
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}
