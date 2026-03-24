# Developer Guide: IQTest Pro

Welcome to the IQTest Pro development team! This guide will help you understand the project's architecture, core logic, and workflow.

## 1. Project Overview
IQTest Pro is a full-stack React application designed for high-precision IQ assessment using Item Response Theory (IRT).

### Key Technologies:
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4.0, Framer Motion, Recharts.
- **Backend:** Node.js, Express.js (for API routes like email and PDF generation).
- **Database:** Firebase Firestore.
- **Authentication:** Firebase Auth.

## 2. Directory Structure
- `src/components`: Reusable UI components (Navbar, Footer, ErrorBoundary).
- `src/pages`: Main application views (About, Blog, Methodology, etc.).
- `src/lib`: Core logic and utility functions.
  - `irt.ts`: Item Response Theory (IRT) implementation (2PL model).
  - `db.ts`: Firestore service for questions, results, and leaderboard.
  - `analytics.ts`: Event tracking and Google Analytics integration.
- `src/context`: React Context providers (AuthContext).
- `src/data`: Static data (local question fallback, country stats, benchmarks).
- `src/test`: Unit and integration tests (Vitest).

## 3. Core Logic: Item Response Theory (IRT)
The test uses a 2-Parameter Logistic (2PL) IRT model to estimate user ability ($\theta$).

### Key Functions (`src/lib/irt.ts`):
- `irtProbability(theta, b, a)`: Calculates the probability of a correct answer given ability ($\theta$), difficulty ($b$), and discrimination ($a$).
- `updateTheta(theta, correct, b, a)`: Updates the user's ability estimate using an EAP (Expected A Posteriori) approach.
- `selectNextQuestion(theta, usedIds, bank)`: Selects the next question from the bank that provides the maximum information at the current $\theta$ level.
- `thetaToIQ(theta)`: Converts the $\theta$ estimate (z-score) to a standard IQ score ($100 + 15\theta$).

## 4. Test Engine Workflow (`src/components/TestEngine.tsx`)
The test follows a multi-phase process:
1. **Warmup (Working Memory):** Simple digit span task.
2. **Warmup (Processing Speed):** Rapid reaction task.
3. **Level Selection:** User chooses difficulty or Adaptive mode.
4. **Active Test:** 20-30 questions (depending on mode).
5. **Results:** Final score calculation and data persistence.

## 5. Database Schema (Firestore)
- `questions`: { id, text, options, correctOptionId, domain, difficulty, discrimination, originalDifficulty }
- `results`: { id, userId, iq, percentile, category, mode, level, correct, total, domainScores, theta, userName, country, date, timestamp }
- `users`: { uid, displayName, email, role, createdAt }

## 6. Development Workflow
### Prerequisites:
- Node.js v18+
- npm

### Setup:
1. Install dependencies: `npm install`
2. Configure environment: Create `.env` based on `.env.example`.
3. Start dev server: `npm run dev`

### Coding Standards:
- **TypeScript:** Use strict types. Avoid `any`.
- **Styling:** Use Tailwind CSS utility classes. Follow the "Luxury/Technical" design recipe.
- **Components:** Prefer functional components and hooks.
- **State Management:** Use `useState` and `useMemo` for local state; React Context for global state (Auth).

## 7. Deployment
The app is configured for deployment on Google Cloud Run.
- **Build:** `npm run build`
- **Start:** `npm start` (runs the Express server which serves the static files).

---
*For any questions, contact the lead developer at workbro81@gmail.com.*
