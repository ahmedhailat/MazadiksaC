# Mazad KSA - Saudi Arabian Auction Platform

A comprehensive bilingual auction platform designed for the Saudi Arabian market with AI-powered recommendations and real-time bidding.

## Features

- **Bilingual Support**: Full Arabic and English interface with RTL support
- **Real-time Bidding**: WebSocket-powered live auction system
- **AI Recommendations**: Personalized auction suggestions using OpenAI
- **User Authentication**: Secure session-based authentication
- **Reward System**: Gamification with points and achievements
- **Mobile Responsive**: Optimized for all device sizes
- **Payment Integration**: Stripe payment processing ready

## Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Vercel with serverless functions
- **AI**: OpenAI GPT-4 for recommendations

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set environment variables:
```bash
DATABASE_URL=your_postgresql_url
SESSION_SECRET=your_session_secret
OPENAI_API_KEY=your_openai_key (optional)
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secure session secret
- `NODE_ENV`: Set to "production"
- `OPENAI_API_KEY`: For AI recommendations (optional)
- `SENDGRID_API_KEY`: For email notifications (optional)
- `STRIPE_SECRET_KEY`: For payments (optional)

## Live Demo
The platform includes 15 sample auctions with categories like construction equipment, vehicles, and electronics, all with Arabic and English descriptions.

## License
MIT License