# About Me API

A centralized "about me" service that provides a single URL for AI tools and applications to fetch user profile data.

## Features

- **Single URL for AI Context**: Give any AI tool your personal API endpoint
- **Progressive Profile Builder**: Fill in your details, then sign up to save
- **Asset Management**: Upload and version profile images
- **Analytics Dashboard**: Track who's accessing your profile API
- **Privacy Controls**: Choose what's public vs private

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Backend**: Supabase Edge Functions (Deno)
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage

## Getting Started

### Prerequisites

- Node.js 20.9+
- Supabase account
- Supabase CLI (for Edge Functions)

### Setup

1. Clone the repository
2. Create a Supabase project at [database.new](https://database.new)
3. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials
4. Install dependencies: `npm install`
5. Run the development server: `npm run dev`

## API Usage

```bash
# Get public profile
curl https://aboutme.knileshh.com/u/username

# Response
{
  "username": "nilesh",
  "identity": {
    "name": { "first": "Nilesh", "last": "Patel" },
    "bio": "Backend developer passionate about distributed systems"
  },
  "presence": {
    "socials": {
      "github": "https://github.com/username"
    }
  },
  ...
}
```

## License

MIT
