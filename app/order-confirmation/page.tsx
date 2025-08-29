"use client"

import { Suspense } from "react"
import { OrderConfirmation } from "@/components/order-confirmation"

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmation />
    </Suspense>
  )
}
