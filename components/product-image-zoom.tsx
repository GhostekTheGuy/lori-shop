"use client"

import { useState, useRef, type MouseEvent } from "react"
import Image from "next/image"
import { Search } from "lucide-react"

interface ProductImageZoomProps {
  src: string
  alt: string
}

export function ProductImageZoom({ src, alt }: ProductImageZoomProps) {
  const [showMagnifier, setShowMagnifier] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  const magnifierSize = 200
  const zoomLevel = 8.5

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (imageRef.current) {
      const { left, top, width, height } = imageRef.current.getBoundingClientRect()

      // Calculate position ratio (0 to 1)
      const x = (e.clientX - left) / width
      const y = (e.clientY - top) / height

      setMousePosition({
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y)),
      })
    }
  }

  const handleMouseEnter = () => {
    setShowMagnifier(true)
  }

  const handleMouseLeave = () => {
    setShowMagnifier(false)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <>
      <div
        className="aspect-square bg-gray-100 relative overflow-hidden cursor-zoom-in group"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={toggleFullscreen}
        ref={imageRef}
      >
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-cover transition-transform duration-200"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Magnifying glass icon */}
        <div className="absolute top-3 right-3 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Search className="h-5 w-5 text-gray-700" />
        </div>

        {/* Magnifier overlay */}
        {showMagnifier && (
          <div
            className="absolute pointer-events-none border-2 border-white shadow-lg"
            style={{
              left: `${mousePosition.x * 100}%`,
              top: `${mousePosition.y * 100}%`,
              width: `${magnifierSize}px`,
              height: `${magnifierSize}px`,
              transform: "translate(-50%, -50%)",
              backgroundImage: `url(${src || "/placeholder.svg"})`,
              backgroundSize: `${100 * zoomLevel}% ${100 * zoomLevel}%`,
              backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
              backgroundRepeat: "no-repeat",
              borderRadius: "8px",
              zIndex: 10,
            }}
          />
        )}
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={toggleFullscreen}>
          <div className="relative w-full max-w-4xl h-auto max-h-[90vh]">
            <Image
              src={src || "/placeholder.svg"}
              alt={alt}
              width={1200}
              height={1200}
              className="object-contain w-full h-full"
            />
            <button
              className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full"
              onClick={toggleFullscreen}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
