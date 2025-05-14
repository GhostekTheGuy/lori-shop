"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { type Collection, createCollection, updateCollection } from "@/actions/collection-actions"
import { Loader2 } from "lucide-react"
import { slugify } from "@/lib/utils"

// Update the form to handle the case where the featured column doesn't exist
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Collection name must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  description: z.string().optional(),
  hero_image: z.string().optional(),
  // Remove published field
})

type FormValues = z.infer<typeof formSchema>

interface AdminCollectionFormProps {
  collection?: Collection
  isEdit?: boolean
}

export function AdminCollectionForm({ collection, isEdit = false }: AdminCollectionFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update the form defaultValues to remove published field
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: collection?.name || "",
      slug: collection?.slug || "",
      description: collection?.description || "",
      hero_image: collection?.hero_image || "",
      // Remove published field
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)

    try {
      if (isEdit && collection) {
        const result = await updateCollection({
          id: collection.id,
          name: values.name,
          slug: values.slug,
          description: values.description || "",
          hero_image: values.hero_image || "",
          // Remove featured field
        })

        if (result.success) {
          toast({
            title: "Collection updated",
            description: "The collection has been updated successfully.",
          })
          router.push("/admin/collections")
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update collection.",
            variant: "destructive",
          })
        }
      } else {
        const result = await createCollection({
          name: values.name,
          slug: values.slug,
          description: values.description || "",
          hero_image: values.hero_image || "",
          // Remove featured field
        })

        if (result.success) {
          toast({
            title: "Collection created",
            description: "The collection has been created successfully.",
          })
          router.push("/admin/collections")
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to create collection.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSlug = () => {
    const name = form.getValues("name")
    if (name) {
      form.setValue("slug", slugify(name))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter collection name" {...field} />
              </FormControl>
              <FormDescription>The name of the collection as it will appear to customers.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-end gap-4">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="enter-slug-here" {...field} />
                  </FormControl>
                  <FormDescription>The URL-friendly version of the name. Used in the URL.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="button" variant="outline" onClick={generateSlug} className="mb-8">
            Generate from Name
          </Button>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter collection description" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormDescription>
                A brief description of the collection. This will be displayed on the collection page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hero_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>
                The URL of the hero image for this collection. This will be displayed at the top of the collection page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/collections")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Collection" : "Create Collection"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
