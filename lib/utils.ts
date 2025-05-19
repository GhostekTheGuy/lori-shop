import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as a currency string in Polish Złoty (PLN)
 * @param amount - The amount to format
 * @returns A formatted currency string (e.g., "123,45 zł")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word [a-zA-Z0-9_], non-space, non-hyphen
    .replace(/[\s_-]+/g, "-") // Replace groups of spaces, underscores, or hyphens with single hyphen
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
}
