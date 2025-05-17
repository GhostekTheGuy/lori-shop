"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface AddressFormProps {
  onSubmitAddress: (address: {
    firstName: string
    lastName: string
    address: string
    city: string
    postalCode: string
    country: string
    phone: string
  }) => void
  isProcessing?: boolean
}

export function AddressForm({ onSubmitAddress, isProcessing = false }: AddressFormProps) {
  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Poland",
    phone: "",
  })

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAddressForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmitAddress(addressForm)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Dane dostawy</h2>
      <form onSubmit={handleAddressSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Imię</Label>
            <Input
              id="firstName"
              name="firstName"
              value={addressForm.firstName}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nazwisko</Label>
            <Input id="lastName" name="lastName" value={addressForm.lastName} onChange={handleAddressChange} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adres</Label>
          <Input id="address" name="address" value={addressForm.address} onChange={handleAddressChange} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Miasto</Label>
            <Input id="city" name="city" value={addressForm.city} onChange={handleAddressChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Kod pocztowy</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={addressForm.postalCode}
              onChange={handleAddressChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Kraj</Label>
            <select
              id="country"
              name="country"
              value={addressForm.country}
              onChange={handleAddressChange}
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            >
              <option value="Poland">Polska</option>
              <option value="Germany">Niemcy</option>
              <option value="France">Francja</option>
              <option value="United Kingdom">Wielka Brytania</option>
              <option value="Italy">Włochy</option>
              <option value="Spain">Hiszpania</option>
              <option value="Netherlands">Holandia</option>
              <option value="Belgium">Belgia</option>
              <option value="Czech Republic">Czechy</option>
              <option value="Slovakia">Słowacja</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" name="phone" value={addressForm.phone} onChange={handleAddressChange} required />
          </div>
        </div>

        <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Przetwarzanie...
            </>
          ) : (
            "Przejdź do płatności"
          )}
        </Button>
      </form>
    </div>
  )
}
