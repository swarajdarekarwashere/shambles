# Monetization Setup Guide

This project uses **Supabase** and **Razorpay** for monetization. Follow these steps to complete the setup.

## 1. Supabase Setup

### Database
Run the SQL in `supabase/schema.sql` in your Supabase SQL Editor. This will create the necessary tables and set up **Row Level Security (RLS)** to protect user data.

### Edge Functions
Deploy the functions in `supabase/functions`:
1. `create-razorpay-order`: Generates Razorpay orders.
2. `razorpay-webhook`: Handles payment confirmation and grants day passes.

Set the following secrets in Supabase:
```bash
supabase secrets set RAZORPAY_KEY_ID=your_key_id
supabase secrets set RAZORPAY_KEY_SECRET=your_key_secret
supabase secrets set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

## 2. Frontend Environment Variables

Add these to your `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The frontend should not store any Razorpay secret, and it no longer needs a dedicated `VITE_RAZORPAY_KEY_ID`. The checkout key is returned by the server only at order-creation time. It is still a public key and will remain visible in the browser because Razorpay Checkout requires that, but the secret must stay only in Supabase Edge Function secrets.

## 3. Razorpay Webhook Configuration

In your Razorpay Dashboard, set the Webhook URL to:
`https://your-project-ref.supabase.co/functions/v1/razorpay-webhook`

Select the following events:
- `payment.captured`

## 4. How it works

1. **Discovery**: Users can browse games without logging in.
2. **Auth Wall**: Clicking "Play Now" triggers `AuthModal`.
3. **First Game Free**: New users can play one full game session for free.
4. **Paywall**: After the first game, or if sessions > 0 and no active pass, an **uncloseable** `PaywallModal` appears.
5. **Unlock**: Paying ₹30 grants a 24-hour pass. The frontend uses **Supabase Realtime** to automatically unlock and close the paywall as soon as the webhook updates the database.
