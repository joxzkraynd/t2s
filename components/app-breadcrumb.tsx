import Link from "next/link"
import React from "react"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface BreadcrumbPath {
  label: string
  href?: string
  /** 
   * 'always' - Always visible
   * 'tablet' - Hidden on mobile, shown on tablet+
   * 'desktop' - Hidden on mobile/tablet, shown on desktop+
   */
  visibility?: 'always' | 'tablet' | 'desktop'
}

interface AppBreadcrumbProps {
  paths: BreadcrumbPath[]
  currentLabel: string
}

export function AppBreadcrumb({ paths, currentLabel }: AppBreadcrumbProps) {
  // Items that will be included in the ellipsis dropdown (anything not 'always' visible)
  const collapsibleItems = paths.filter(p => p.visibility !== 'always')

  const getVisibilityClass = (visibility?: string) => {
    switch (visibility) {
      case 'tablet': return "hidden sm:block"
      case 'desktop': return "hidden md:block"
      default: return ""
    }
  }

  return (
    <Breadcrumb aria-label="Breadcrumb navigation">
      <BreadcrumbList>
        {/* Render paths */}
        {paths.map((path) => (
          <React.Fragment key={path.href || path.label}>
            <BreadcrumbItem className={getVisibilityClass(path.visibility)}>
              {path.href ? (
                <BreadcrumbLink asChild>
                  <Link href={path.href}>{path.label}</Link>
                </BreadcrumbLink>
              ) : (
                <span>{path.label}</span>
              )}
            </BreadcrumbItem>
            
            {/* Separator matches item visibility */}
            <BreadcrumbSeparator className={getVisibilityClass(path.visibility)} />
          </React.Fragment>
        ))}

        {/* Ellipsis Dropdown (Visible only if there's hidden items at current breakpoint) */}
        {collapsibleItems.length > 0 && (
          <>
            <BreadcrumbItem className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8"
                    aria-label="Show more paths"
                  >
                    <BreadcrumbEllipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {collapsibleItems.map((item) => (
                    <DropdownMenuItem 
                      key={item.label} 
                      asChild
                      // On tablet, we might want to hide items already shown in the bar
                      className={item.visibility === 'tablet' ? "sm:hidden" : ""}
                    >
                      <Link href={item.href || "#"}>{item.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="md:hidden" />
          </>
        )}

        {/* Current Page */}
        <BreadcrumbItem>
          <BreadcrumbPage 
            className="max-w-[150px] truncate font-medium sm:max-w-[250px] md:max-w-none"
            title={currentLabel}
          >
            {currentLabel}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
