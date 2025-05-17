"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const slides = [
  {
    id: 1,
    image: "/images/slider-1.jpg",
    title: "Fils de L'esthétique",
    subtitle: "Rooted in design, refined through sewing craft, faultless in form.",
  },
  {
    id: 2,
    image: "/images/slider-2.jpg",
    title: "Kolekcja Jesień 2023",
    subtitle: "Odkryj nowe trendy i stylizacje na nadchodzący sezon.",
  },
  {
    id: 3,
    image: "/images/slider-3.jpg",
    title: "Miejski Styl",
    subtitle: "Ubrania stworzone z myślą o nowoczesnym, miejskim stylu życia.",
  },
  {
    id: 4,
    image: "/images/slider-4.png",
    title: "Limitowana Edycja",
    subtitle: "Ekskluzywne projekty dostępne tylko przez ograniczony czas.",
  },
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 8000) // Zmiana slajdu co 8 sekund

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[80vh] overflow-hidden">
      {/* Slajdy */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="relative h-full w-full">
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4">
                <h2
                  className={`text-5xl font-bold text-white mb-4 transform transition-transform duration-1000 ${
                    index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: "300ms" }}
                >
                  {slide.title}
                </h2>
                <p
                  className={`text-lg text-white mb-8 transform transition-transform duration-1000 ${
                    index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: "500ms" }}
                >
                  {slide.subtitle}
                </p>
                <div
                  className={`flex items-center justify-center gap-4 transform transition-transform duration-1000 ${
                    index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: "700ms" }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent text-white border-white hover:bg-white hover:text-black"
                  >
                    Shop Now
                  </Button>
                  <Button variant="secondary" size="lg">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Przyciski nawigacyjne */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Wskaźniki slajdów */}
      <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-6" : "bg-white bg-opacity-50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
