"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { CartDrawer } from "@/components/cart-drawer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    urgent: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // Animation states
  const [isVisible, setIsVisible] = useState(false)
  const [animationStage, setAnimationStage] = useState(0)

  useEffect(() => {
    // Start the animation sequence
    setIsVisible(true)

    // Staggered animation for form elements
    const timer1 = setTimeout(() => setAnimationStage(1), 200)
    const timer2 = setTimeout(() => setAnimationStage(2), 400)
    const timer3 = setTimeout(() => setAnimationStage(3), 600)
    const timer4 = setTimeout(() => setAnimationStage(4), 800)
    const timer5 = setTimeout(() => setAnimationStage(5), 1000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
    }
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: boolean } },
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      // In a real application, you would send the form data to your backend
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitSuccess(true)
      setFormData({
        name: "",
        email: "",
        message: "",
        urgent: false,
      })
    } catch (error) {
      setSubmitError("Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie później.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="container mx-auto px-4 pt-24 pb-32 min-h-[calc(100vh-200px)]">
        <div className="max-w-3xl mx-auto">
          <h1
            className={`text-3xl font-bold text-center mb-16 transition-all duration-700 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            FORMULARZ KONTAKTOWY
          </h1>

          {submitSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-12 text-center transition-all duration-500 transform opacity-100 scale-100 my-20">
              <h2 className="text-2xl font-medium text-green-800 mb-4">Dziękujemy za wiadomość!</h2>
              <p className="text-green-700 mb-8 text-lg">
                Twoja wiadomość została wysłana. Odpowiemy najszybciej jak to możliwe.
              </p>
              <Button
                onClick={() => setSubmitSuccess(false)}
                className="bg-black text-white hover:bg-gray-800 py-3 px-8"
              >
                Wyślij kolejną wiadomość
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              <div
                className={`transition-all duration-500 transform ${
                  animationStage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Imię i Nazwisko"
                  className="border-b border-gray-300 rounded-none px-3 py-3 focus:border-black focus:ring-0 text-lg"
                  required
                />
              </div>

              <div
                className={`transition-all duration-500 transform ${
                  animationStage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Adres Email"
                  className="border-b border-gray-300 rounded-none px-3 py-3 focus:border-black focus:ring-0 text-lg"
                  required
                />
              </div>

              <div
                className={`transition-all duration-500 transform ${
                  animationStage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="W czym możemy pomóc?
Jeżeli piszesz w sprawie złożonego zamówienia, podaj proszę jego numer."
                  className="border-b border-gray-300 rounded-none px-3 py-3 min-h-[200px] focus:border-black focus:ring-0 resize-none text-lg"
                  required
                />
              </div>

              <div
                className={`transition-all duration-500 transform ${
                  animationStage >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <p className="text-base mb-3">Opcjonalnie</p>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="urgent"
                    name="urgent"
                    checked={formData.urgent}
                    onCheckedChange={(checked) => {
                      handleChange({
                        target: {
                          name: "urgent",
                          value: checked as boolean,
                        },
                      })
                    }}
                    className="h-5 w-5"
                  />
                  <label htmlFor="urgent" className="text-base cursor-pointer">
                    Pilne
                  </label>
                </div>
              </div>

              {submitError && <p className="text-red-500 text-base">{submitError}</p>}

              <div
                className={`transition-all duration-500 transform pt-6 ${
                  animationStage >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white hover:bg-gray-800 py-4 text-lg"
                >
                  {isSubmitting ? "Wysyłanie..." : "Wyślij"}
                </Button>
              </div>

              {/* Additional spacing element */}
              <div className="h-20"></div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
