"use client"

import type React from "react"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface CheckoutFormProps {
  onSuccess?: () => void
  isAddressForm?: boolean
  onSubmitAddress?: (address: {
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

export function CheckoutForm({
  onSuccess,
  isAddressForm = false,
  onSubmitAddress,
  isProcessing = false,
}: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
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
    if (onSubmitAddress) {
      onSubmitAddress(addressForm)
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: "if_required",
    })

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.")
      setIsSubmitting(false)
    } else {
      // Payment succeeded
      if (onSuccess) {
        onSuccess()
      }
    }
  }

  if (isAddressForm) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
        <form onSubmit={handleAddressSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={addressForm.firstName}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={addressForm.lastName}
                onChange={handleAddressChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" value={addressForm.address} onChange={handleAddressChange} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" value={addressForm.city} onChange={handleAddressChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
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
              <Label htmlFor="country">Country</Label>
              <select
                id="country"
                name="country"
                value={addressForm.country}
                onChange={handleAddressChange}
                className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="Poland">Poland</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Italy">Italy</option>
                <option value="Spain">Spain</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Belgium">Belgium</option>
                <option value="Czech Republic">Czech Republic</option>
                <option value="Slovakia">Slovakia</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={addressForm.phone} onChange={handleAddressChange} required />
            </div>
          </div>

          <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Continue to Payment"
            )}
          </Button>
        </form>
      </div>
    )
  }

  return (
    <form onSubmit={handlePaymentSubmit} className="space-y-6">
      <PaymentElement />

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{errorMessage}</div>
      )}

      <Button
        type="submit"
        className="w-full bg-black hover:bg-gray-800 text-white"
        disabled={!stripe || !elements || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          "Pay Now"
        )}
      </Button>
    </form>
  )
}
