# SmartBot - WhatsApp Chatbot Platform

A web-based platform for creating and managing WhatsApp chatbots powered by OpenAI's API and GreenAPI for WhatsApp integration.

## Tech Stack

- **Frontend/Backend**: Next.js (with API routes)
- **Authentication**: Google OAuth 2.0
- **AI Engine**: OpenAI API
- **Database**: Supabase (PostgreSQL)
- **WhatsApp Integration**: GreenAPI
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm
- Google Cloud Console account (for OAuth)
- OpenAI API key
- Supabase account and project
- GreenAPI account

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Authentication
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""

# Supabase
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

# OpenAI
OPENAI_API_KEY=""

# GreenAPI (WhatsApp)
GREENAPI_INSTANCE_ID=""
GREENAPI_API_TOKEN=""
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- User authentication via Google
- Dashboard to create and configure chatbots
- WhatsApp integration via GreenAPI
- Persistent storage of chatbot configurations
- Conversation history tracking

## Project Structure

```
src/
├── app/              # Next.js 13+ App Router
│   ├── api/         # API routes
│   └── auth/        # Authentication routes
├── components/       # React components
├── lib/             # Library code
├── types/           # TypeScript types
└── utils/           # Utility functions
```

## License

MIT
