import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const RAZORPAY_WEBHOOK_SECRET = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')

const hmac = async (secret: string, body: string) => {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

serve(async (req) => {
  try {
    const signature = req.headers.get('x-razorpay-signature')
    const body = await req.text()

    console.log("Webhook received. Signature:", signature);

    if (!RAZORPAY_WEBHOOK_SECRET) {
      console.error("RAZORPAY_WEBHOOK_SECRET not found in environment");
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 })
    }

    // 1. Verify Signature
    const expectedSignature = await hmac(RAZORPAY_WEBHOOK_SECRET, body);
    
    if (signature !== expectedSignature) {
      console.error("Signature mismatch. Expected:", expectedSignature, "Received:", signature);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401 })
    }

    const payload = JSON.parse(body)
    const event = payload.event
    const payment = payload.payload.payment.entity
    const orderId = payment.order_id
    const paymentId = payment.id
    const amount = payment.amount
    const currency = payment.currency // Extract currency!
    const userId = payment.notes?.user_id

    console.log("Verified event:", event, "Order:", orderId, "User:", userId, "Currency:", currency);

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // 2. Log Webhook to database
    const { error: logError } = await supabase.from('razorpay_webhooks').insert({
      event_type: event,
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      user_id: userId,
      payload: payload,
      currency: currency, // Log currency!
    })

    if (logError) console.error("Error logging webhook:", logError);

    if (event === 'payment.captured') {
      if (!userId) {
        console.error("No user_id found in payment notes");
        return new Response(JSON.stringify({ error: 'User ID missing' }), { status: 400 })
      }

      // 3. Grant Day Pass (24 hours)
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      console.log("Granting day pass to user:", userId, "Expires:", expiresAt.toISOString());

      const { error: passError } = await supabase.from('day_passes').insert({
        user_id: userId,
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        amount_paid: amount,
        currency: currency, // Save currency!
        expires_at: expiresAt.toISOString(),
        status: 'active'
      })

      if (passError) {
        console.error("Error creating day pass:", passError);
        return new Response(JSON.stringify({ error: 'Failed to create pass' }), { status: 500 })
      }

      // 4. Mark webhook as processed
      await supabase
        .from('razorpay_webhooks')
        .update({ processed: true })
        .eq('razorpay_payment_id', paymentId);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    console.error("Webhook processing error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})
