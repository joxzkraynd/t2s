"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PlusIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FieldError } from "@/components/ui/field"

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").trim(),
})

type CreateProjectValues = z.infer<typeof createProjectSchema>

export function CreateProjectDialog() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = (data: CreateProjectValues) => {
    // Add your project creation logic here
    console.log("Project created", data.name)
    reset()
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button>New Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Add a new project to your studio. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Field>
              <FieldLabel htmlFor="name">Project Name</FieldLabel>
              <Input
                id="name"
                placeholder="e.g. My Awesome Podcast"
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={!isValid || !isDirty}>
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
