# OmniMind AI Frontend

This is the frontend application for OmniMind AI, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Modern UI/UX**: Glass morphism, gradient animations, and particle effects
- **Interactive Components**: Voice input, smart suggestions, and real-time feedback
- **Responsive Design**: Mobile-first approach with touch-optimized interactions
- **Advanced Animations**: Framer Motion for smooth transitions and micro-interactions
- **Performance Optimized**: Lazy loading, efficient re-renders, and optimized assets

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend API running on port 8000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ai/               # AI-specific components
│   │   ├── AgentCard.tsx
│   │   ├── AgentWorkflow.tsx
│   │   ├── ConsensusPanel.tsx
│   │   ├── QueryInterface.tsx
│   │   ├── SimulationResults.tsx
│   │   └── WorkflowProgress.tsx
│   ├── layout/           # Layout components
│   │   └── Header.tsx
│   ├── sections/         # Page sections
│   │   ├── Features.tsx
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   └── UseCases.tsx
│   └── ui/              # UI components
│       ├── LoadingScreen.tsx
│       └── ParticleBackground.tsx
├── lib/                 # Utilities and helpers
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks
```

## Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Radix UI**: Headless UI components
- **React Hook Form**: Form handling
- **Zustand**: State management
- **Recharts**: Chart library

## Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Deployment

The frontend can be deployed to Vercel, Netlify, or any platform that supports Next.js:

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new components
3. Add proper error handling and loading states
4. Test responsive design on multiple screen sizes
5. Optimize for performance and accessibility