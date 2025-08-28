import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerClient } from "@/lib/supabase/server";

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-08-27.basil",
    })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

async function createOrder(paymentIntent: Stripe.PaymentIntent) {
    const supabase = createServerClient();
    const { userId, items: itemsString } = paymentIntent.metadata;
    const items = JSON.parse(itemsString);
  
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          total: paymentIntent.amount / 100,
          status: "processing",
          shipping_address: paymentIntent.shipping as any,
        },
      ])
      .select();
  
    if (orderError) {
      console.error("Error creating order:", orderError);
      return;
    }
  
    const order = orderData[0];
  
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      selected_size: item.selectedSize,
    }));
  
    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItems);
  
    if (orderItemsError) {
      console.error("Error creating order items:", orderItemsError);
    }
  }

export async function POST(req: Request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe configuration missing" }, 
      { status: 500 }
    );
  }

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      await createOrder(paymentIntent);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}