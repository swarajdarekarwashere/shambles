import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as crypto from "https://deno.land/std@0.177.0/node/crypto.ts";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const RAZORPAY_WEBHOOK_SECRET = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')

serve(async (req) => {
  try {
    const signature = req.headers.get('x-razorpay-signature')
    const body = await req.text()

    // 1. Verify Signature
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401 })
    }

    const payload = JSON.parse(body)
    const event = payload.event
    const orderId = payload.payload.payment.entity.order_id
    const paymentId = payload.payload.payment.entity.id
    const amount = payload.payload.payment.entity.amount

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // 2. Log Webhook
    await supabase.from('razorpay_webhooks').insert({
      event_type: event,
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      payload: payload,
    })

    if (event === 'payment.captured') {
      // 3. Find User ID from order_id (this assumes you stored it somewhere or pass it in notes)
      // For this implementation, we'll assume the userId is passed in the notes of the Razorpay order
      const userId = payload.payload.payment.entity.notes?.user_id

      if (userId) {
        // 4. Grant Day Pass (24 hours)
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 24)

        await supabase.from('day_passes').insert({
          user_id: userId,
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          amount_paid: amount,
          expires_at: expiresAt.toISOString(),
          status: 'active'
        })
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})
