"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { createHeroSlide, updateHeroSlide, type HeroSlide } from "@/actions/hero-slide-actions"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface AdminHeroSlideFormProps {
  slide?: HeroSlide
  isEditing?: boolean
}

export function AdminHeroSlideForm({ slide, isEditing = false }: AdminHeroSlideFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(slide?.image || null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      let result

      if (isEditing && slide) {
        result = await updateHeroSlide(slide.id, formData)
      } else {
        result = await createHeroSlide(formData)
      }

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        router.push("/admin/hero-slides")
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPreviewImage(value)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={slide?.title || ""} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Display Order</Label>
            <Input id="display_order" name="display_order" type="number" defaultValue={slide?.display_order || 0} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Textarea id="subtitle" name="subtitle" defaultValue={slide?.subtitle || ""} rows={3} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" name="image" defaultValue={slide?.image || ""} onChange={handleImageChange} required />
          <p className="text-sm text-gray-500">Enter the URL of the image. Recommended size: 1920x1080px.</p>
        </div>

        {previewImage && (
          <div className="space-y-2">
            <Label>Image Preview</Label>
            <div className="relative w-full h-48 overflow-hidden rounded-md border">
              <Image src={previewImage || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Switch id="active" name="active" defaultChecked={slide?.active !== false} />
          <Label htmlFor="active">Active</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/hero-slides")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Update Slide" : "Create Slide"}
        </Button>
      </div>
    </form>
  )
}
