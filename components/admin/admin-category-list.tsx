"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"
import { deleteCategory } from "@/actions/category-actions"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
}

interface AdminCategoryListProps {
  categories: Category[]
}

export function AdminCategoryList({ categories }: AdminCategoryListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setIsDeleting(id)
      setError(null)

      try {
        const result = await deleteCategory(id)
        if (!result.success) {
          setError(result.error || "Failed to delete category")
        }
      } catch (err) {
        setError("An unexpected error occurred")
        console.error(err)
      } finally {
        setIsDeleting(null)
      }
    }
  }

  if (categories.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-md text-center">
        <p className="text-gray-500">No categories found. Create your first category to get started.</p>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-md shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Slug
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{category.name}</div>
                  {category.description && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">{category.description}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(category.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link href={`/admin/categories/edit/${category.id}`} className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={isDeleting === category.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
