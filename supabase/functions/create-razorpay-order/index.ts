import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')

const PRICE_BOOK = {
  INR: { amount: 1000, currency: 'INR' },
  USD: { amount: 200, currency: 'USD' },
  GBP: { amount: 200, currency: 'GBP' },
} as const

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials are not configured on the server.')
    }

    const { currency = 'INR', userId } = await req.json()

    if (!userId) {
      throw new Error('Authenticated user id is required.')
    }

    const normalizedCurrency = typeof currency === 'string' ? currency.toUpperCase() : 'INR'
    const selectedPrice = PRICE_BOOK[normalizedCurrency as keyof typeof PRICE_BOOK] ?? PRICE_BOOK.INR
    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: selectedPrice.amount,
        currency: selectedPrice.currency,
        receipt: `receipt_${Math.random().toString(36).substring(7)}`,
        notes: {
          user_id: userId
        }
      })
    })

    if (!response.ok) {
      const message = await response.text()
      throw new Error(`Razorpay order creation failed: ${message}`)
    }

    const order = await response.json()
    console.log("Created order:", order.id, "for user:", userId);

    return new Response(JSON.stringify({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RAZORPAY_KEY_ID,
      keyId: RAZORPAY_KEY_ID,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error("Order creation error:", message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
