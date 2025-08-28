import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerClient } from "@/lib/supabase/server";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-08-27.basil",
    })
  : null;

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe configuration missing" }, 
      { status: 500 }
    );
  }

  const { items, customer } = await req.json();
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Basic validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "Missing or invalid items" },
      { status: 400 }
    );
  }

  if (!customer) {
    return NextResponse.json(
      { error: "Missing customer information" },
      { status: 400 }
    );
  }

  try {
    // In a real application, you would fetch product prices from your database
    // to prevent price manipulation on the client-side.
    const amount = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const totalAmount = Math.round(amount * 1.08 * 100); // 8% tax

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
      receipt_email: customer.email,
      metadata: {
        userId: user.id,
        items: JSON.stringify(items),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}