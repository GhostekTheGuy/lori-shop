"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createCategory, updateCategory } from "@/actions/category-actions"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

interface AdminCategoryFormProps {
  category?: Category
}

export function AdminCategoryForm({ category }: AdminCategoryFormProps) {
  const router = useRouter()
  const [name, setName] = useState(category?.name || "")
  const [slug, setSlug] = useState(category?.slug || "")
  const [description, setDescription] = useState(category?.description || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Automatycznie generuj slug na podstawie nazwy
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)

    // Tylko generuj slug automatycznie, jeśli użytkownik nie edytował go ręcznie
    // lub jeśli tworzymy nową kategorię
    if (!category || slug === category.slug) {
      setSlug(
        newName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      let result

      if (category) {
        // Aktualizacja istniejącej kategorii
        result = await updateCategory(category.id, {
          name,
          slug,
          description: description || undefined,
        })
      } else {
        // Tworzenie nowej kategorii
        result = await createCategory({
          name,
          slug,
          description: description || undefined,
        })
      }

      if (result.success) {
        router.push("/admin/categories")
      } else {
        setError(result.error || "Failed to save category")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-md shadow">
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">URL-friendly version of the name. Used in category URLs.</p>
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/admin/categories")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : category ? "Update Category" : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  )
}
