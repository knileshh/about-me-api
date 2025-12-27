# About Me API

A centralized "about me" service that provides a single URL for AI tools and applications to fetch user profile data.

## 🎯 The Problem

In this AI era, you constantly need to provide context about yourself:
- When using new AI tools or chatbots
- When building demo portfolio sites
- When sharing your info across platforms

**About Me API** solves this by giving you a single URL that returns all your information in a structured format.

## ✨ Features

- **Single URL for AI Context**: Give any AI tool your personal API endpoint
- **Progressive Profile Builder**: Fill in your details, then sign up to save
- **Versioned Assets**: Upload multiple profile images, use "v1" or "v2" as needed
- **Analytics Dashboard**: Track who's accessing your profile API
- **Privacy Controls**: Choose what's public vs private

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase Edge Functions (Deno)
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth (cookie-based SSR)
- **Storage**: Supabase Storage
- **UI**: shadcn/ui components

## 🚀 Getting Started

### Prerequisites

- Node.js 20.9+
- Supabase account

### Setup

1. Clone the repository
2. Create a Supabase project at [database.new](https://database.new)
3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000)

## 📡 API Usage

```bash
# Get public profile
curl https://about-me-api.xyz/api/nilesh

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
  "assets": {
    "avatar": "https://about-me-api.xyz/nilesh/avatar"
  }
}
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── auth/              # Auth pages (login, signup)
│   ├── protected/         # Protected routes (dashboard)
│   └── page.tsx           # Landing page
├── components/            # React components (shadcn/ui)
├── lib/
│   └── supabase/          # Supabase client utilities
├── supabase/              # Supabase Edge Functions
│   └── functions/
└── shema-demo.json        # Profile schema reference
```

## 📊 Profile Schema

See `shema-demo.json` for the complete profile data structure including:
- Identity (name, bio, DOB)
- Location (hometown, current city, timezone)
- Contact (emails, phones - with privacy settings)
- Presence (social links, competitive programming profiles)
- Career (current status, roles, preferences)
- Assets (versioned profile images)
- Artifacts (resumes, projects)
- Experience (work history)

## 🔐 Privacy

- Public fields visible to anyone with your URL
- Private fields require API key authentication
- You control what's shared

## License

MIT
