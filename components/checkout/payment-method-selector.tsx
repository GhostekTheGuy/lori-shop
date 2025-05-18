"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CreditCard } from "lucide-react"

interface PaymentMethodSelectorProps {
  onChange: (method: string) => void
  defaultValue?: string
}

export function PaymentMethodSelector({ onChange, defaultValue = "card" }: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState(defaultValue)

  const handleChange = (value: string) => {
    setSelectedMethod(value)
    onChange(value)
  }

  return (
    <Tabs defaultValue={selectedMethod} onValueChange={handleChange} className="w-full mb-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="card" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span>Karta płatnicza</span>
        </TabsTrigger>
        <TabsTrigger value="p24" className="flex items-center gap-2">
          <div className="relative w-4 h-4 flex items-center justify-center">
            <span className="font-bold text-xs">B</span>
          </div>
          <span>BLIK / Przelew24</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="card" className="mt-4">
        <p className="text-sm text-gray-500 mb-4">
          Zapłać kartą kredytową lub debetową. Obsługujemy karty Visa, Mastercard i inne.
        </p>
      </TabsContent>

      <TabsContent value="p24" className="mt-4">
        <p className="text-sm text-gray-500 mb-4">Zapłać za pomocą BLIK lub przelewu bankowego przez Przelewy24.</p>
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-blue-600 text-white font-bold px-2 py-1 rounded text-xs">BLIK</div>
          <div className="text-xs text-gray-500">Szybka płatność kodem z aplikacji bankowej</div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
