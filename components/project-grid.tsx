"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { MoreHorizontalIcon, PencilIcon, Share2Icon, TrashIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Project {
  id: string
  title: string
  description: string
}

interface ProjectGridProps {
  projects: Project[]
}

function ProjectItem({ project }: { project: Project }) {
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const shareLink = `http://localhost:3000/app/studio/${project.id}`

  const handleShare = () => {
    setShowShareDialog(true)
    navigator.clipboard.writeText(shareLink).then(() => {
      toast.success("Link copied", {
        description: "The project link has been copied to your clipboard.",
      })
    })
  }

  return (
    <>
      <Item variant="outline" className="h-full" asChild>
        <Link href={`/app/studio/${project.id}`}>
          <ItemContent>
            <ItemTitle>{project.title}</ItemTitle>
            <ItemDescription>{project.description}</ItemDescription>
          </ItemContent>
          <ItemActions
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={handleShare}>
                  <Share2Icon />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowRenameDialog(true)}>
                  <PencilIcon />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => setShowDeleteDialog(true)}
                >
                  <TrashIcon />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ItemActions>
        </Link>
      </Item>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent
          className="sm:max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              toast.success("Project renamed", {
                description: `The project has been renamed to "${(e.currentTarget.elements.namedItem("name") as HTMLInputElement).value}".`,
              })
              setShowRenameDialog(false)
            }}
          >
            <DialogHeader>
              <DialogTitle>Rename Project</DialogTitle>
              <DialogDescription>
                Enter a new name for your project.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Field>
                <FieldLabel htmlFor={`rename-${project.id}`}>
                  Project Name
                </FieldLabel>
                <Input
                  id={`rename-${project.id}`}
                  name="name"
                  defaultValue={project.title}
                  required
                />
              </Field>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share link</DialogTitle>
            <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor={`link-${project.id}`} className="sr-only">
                Link
              </Label>
              <Input
                id={`link-${project.id}`}
                defaultValue={shareLink}
                readOnly
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              project and all of its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                toast.success("Project deleted", {
                  description: `"${project.title}" has been removed.`,
                  action: {
                    label: "Undo",
                    onClick: () => console.log("Undo delete"),
                  },
                })
                setShowDeleteDialog(false)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <ItemGroup className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </ItemGroup>
  )
}
