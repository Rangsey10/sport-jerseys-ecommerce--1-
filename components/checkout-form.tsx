"use client";

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button disabled={isLoading || !stripe || !elements} className="w-full mt-4">
        {isLoading ? "Processing..." : "Pay now"}
      </Button>
    </form>
  );
}