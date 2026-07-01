# Smart Parking — Web Admin

Owner dashboard for the Smart Parking system, built with Next.js and Supabase.

🔗 Live: https://smart-parking-admin-green.vercel.app/

## Stack

- Next.js (App Router)
- TypeScript
- Supabase (PostgreSQL + Auth + Storage)
- Stripe (payments)
- Groq (AI features)
- React Context + SSR for state

## Features

- Owner authentication via Supabase
- Manage parking lots, lot types and pricing
- Monitor reservations and their status in real time
- Track payments and transaction status via Stripe
- Manage agents assigned to each parking lot
- Subscription plan management and billing
- Bank account setup for payouts
- View reviews and ratings per parking lot
- Notifications and messaging with drivers/agents
- Vehicle and maintenance history overview

## Data Model

- **profiles** — base user, linked to Supabase auth, has roles (driver, owner, agent)
- **vehicles** — owned by a driver, with dimensions for lot matching
- **vehicle_maintenances** — maintenance history per vehicle
- **lot_types** — vehicle type categories with max dimensions
- **parking_lots** — owned by a profile, has type, spots, price, location and agents
- **reservations** — links driver, vehicle and lot with start/end time and status
- **payments** — linked to a reservation, tracks amount, method and status
- **bank_accounts** — payout account per owner
- **subscription_plans** — available plans with features
- **subscriptions** — active plan per owner
- **notifications** — targeted per profile
- **conversations** / **messages** — direct messaging between profiles
- **reviews** — rating and feedback per lot, by a user

## Getting Started

```bash
npm install
npm run dev
```

Set the following environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

GROQ_API_KEY=
```
