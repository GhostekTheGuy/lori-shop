"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

interface SizeChartModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SizeChartModal({ isOpen, onClose }: SizeChartModalProps) {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = "hidden"
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => {
        document.body.style.overflow = "auto"
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!mounted || !isOpen) return null

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className={`relative max-w-3xl w-full bg-white rounded-lg shadow-xl transform transition-transform duration-300 max-h-[90vh] overflow-auto ${
          isVisible ? "translate-y-0" : "translate-y-8"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Tabela Rozmiarów</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-medium mb-2">Jak zmierzyć się prawidłowo:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                <strong>Klatka piersiowa:</strong> Zmierz obwód w najszerszym miejscu klatki piersiowej, trzymając taśmę
                poziomo.
              </li>
              <li>
                <strong>Talia:</strong> Zmierz obwód w najwęższym miejscu talii, zwykle na wysokości pępka.
              </li>
              <li>
                <strong>Biodra:</strong> Zmierz obwód w najszerszym miejscu bioder.
              </li>
            </ul>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Rozmiar</th>
                  <th className="border p-2 text-center">Klatka piersiowa (cm)</th>
                  <th className="border p-2 text-center">Talia (cm)</th>
                  <th className="border p-2 text-center">Biodra (cm)</th>
                  <th className="border p-2 text-center">Odpowiednik EU</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-medium">XS</td>
                  <td className="border p-2 text-center">86-90</td>
                  <td className="border p-2 text-center">70-74</td>
                  <td className="border p-2 text-center">90-94</td>
                  <td className="border p-2 text-center">42-44</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium">S</td>
                  <td className="border p-2 text-center">90-94</td>
                  <td className="border p-2 text-center">74-78</td>
                  <td className="border p-2 text-center">94-98</td>
                  <td className="border p-2 text-center">44-46</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">M</td>
                  <td className="border p-2 text-center">94-98</td>
                  <td className="border p-2 text-center">78-82</td>
                  <td className="border p-2 text-center">98-102</td>
                  <td className="border p-2 text-center">46-48</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium">L</td>
                  <td className="border p-2 text-center">98-102</td>
                  <td className="border p-2 text-center">82-86</td>
                  <td className="border p-2 text-center">102-106</td>
                  <td className="border p-2 text-center">48-50</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">XL</td>
                  <td className="border p-2 text-center">102-106</td>
                  <td className="border p-2 text-center">86-90</td>
                  <td className="border p-2 text-center">106-110</td>
                  <td className="border p-2 text-center">50-52</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium">XXL</td>
                  <td className="border p-2 text-center">106-110</td>
                  <td className="border p-2 text-center">90-94</td>
                  <td className="border p-2 text-center">110-114</td>
                  <td className="border p-2 text-center">52-54</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p>
              Uwaga: Tabela rozmiarów ma charakter orientacyjny. Rzeczywiste wymiary mogą się nieznacznie różnić w
              zależności od kroju i modelu.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
