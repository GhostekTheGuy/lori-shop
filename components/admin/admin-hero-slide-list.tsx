"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type HeroSlide, deleteHeroSlide } from "@/actions/hero-slide-actions"
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface AdminHeroSlideListProps {
  slides: HeroSlide[]
}

export function AdminHeroSlideList({ slides }: AdminHeroSlideListProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [localSlides, setLocalSlides] = useState<HeroSlide[]>(slides)

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this slide?")) {
      setIsDeleting(id)

      try {
        const result = await deleteHeroSlide(id)

        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
          })

          // Update local state
          setLocalSlides(localSlides.filter((slide) => slide.id !== id))
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
        setIsDeleting(null)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hero Slides</h2>
        <Link href="/admin/hero-slides/add">
          <Button>Add New Slide</Button>
        </Link>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localSlides.length > 0 ? (
              localSlides.map((slide) => (
                <TableRow key={slide.id}>
                  <TableCell>
                    <div className="relative w-16 h-10 overflow-hidden rounded">
                      <Image src={slide.image || "/placeholder.svg"} alt={slide.title} fill className="object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>{slide.title}</TableCell>
                  <TableCell>{slide.display_order}</TableCell>
                  <TableCell>
                    {slide.active ? (
                      <span className="flex items-center text-green-600">
                        <Eye className="w-4 h-4 mr-1" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-500">
                        <EyeOff className="w-4 h-4 mr-1" /> Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/hero-slides/edit/${slide.id}`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(slide.id)}
                        disabled={isDeleting === slide.id}
                      >
                        {isDeleting === slide.id ? (
                          <span className="animate-spin">...</span>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No hero slides found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
