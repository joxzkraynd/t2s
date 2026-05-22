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
  href: string
  /** 
   * 'always' - Selalu muncul di bar
   * 'tablet' - Muncul di bar mulai layar tablet (sm)
   * 'desktop' - Muncul di bar mulai layar desktop (md)
   * Jika dikosongkan, hanya akan muncul di dropdown.
   */
  visibility?: 'always' | 'tablet' | 'desktop'
}

interface AppBreadcrumbProps {
  paths: BreadcrumbPath[]
  currentLabel: string
}

export function AppBreadcrumb({ paths, currentLabel }: AppBreadcrumbProps) {
  const getVisibilityClass = (visibility?: string) => {
    switch (visibility) {
      case 'always': return ""
      case 'tablet': return "hidden sm:block"
      case 'desktop': return "hidden md:block"
      default: return "hidden"
    }
  }

  // Logika visibilitas ikon "..."
  const getEllipsisVisibilityClass = () => {
    if (paths.length === 0) return "hidden"
    
    // Cek apakah ada item yang "Hanya di Dropdown" atau tersembunyi di breakpoint tertentu
    const hasHiddenOnDesktop = paths.some(p => !p.visibility)
    const hasHiddenOnTablet = paths.some(p => !p.visibility || p.visibility === 'desktop')
    const hasHiddenOnMobile = paths.some(p => p.visibility !== 'always')

    let classes = "flex" // default visible
    if (!hasHiddenOnMobile) classes += " hidden"
    if (!hasHiddenOnTablet) classes += " sm:hidden"
    if (!hasHiddenOnDesktop) classes += " md:hidden"
    
    return classes
  }

  return (
    <Breadcrumb aria-label="Breadcrumb navigation">
      <BreadcrumbList>
        {/* Render Jalur Statis */}
        {paths.map((path) => (
          <React.Fragment key={path.href}>
            <BreadcrumbItem className={getVisibilityClass(path.visibility)}>
              <BreadcrumbLink asChild>
                <Link href={path.href}>{path.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className={getVisibilityClass(path.visibility)} />
          </React.Fragment>
        ))}

        {/* Dropdown Ellipsis */}
        {paths.length > 0 && (
          <>
            <BreadcrumbItem className={getEllipsisVisibilityClass()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8"
                  >
                    <BreadcrumbEllipsis />
                    <span className="sr-only">Buka menu navigasi</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {paths.map((item) => (
                    <DropdownMenuItem 
                      key={item.href} 
                      asChild
                      className={
                        item.visibility === 'always' 
                          ? "hidden" 
                          : item.visibility === 'tablet' 
                            ? "sm:hidden" 
                            : item.visibility === 'desktop' 
                              ? "md:hidden" 
                              : ""
                      }
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator className={getEllipsisVisibilityClass()} />
          </>
        )}

        {/* Halaman Aktif */}
        <BreadcrumbItem>
          <BreadcrumbPage 
            className="max-w-[140px] truncate font-semibold sm:max-w-[240px] md:max-w-none text-foreground"
            title={currentLabel}
          >
            {currentLabel}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
