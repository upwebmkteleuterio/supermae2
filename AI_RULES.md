# AI Rules & Architecture Guidelines - Super Mãe

## Tech Stack
- **Framework**: React 19 with TypeScript.
- **Build Tool**: Vite for fast development and bundling.
- **Styling**: Tailwind CSS for utility-first responsive design.
- **UI Components**: Radix UI primitives and shadcn/ui patterns.
- **Icons**: Lucide React for consistent iconography.
- **Backend / Auth**: Supabase (PostgreSQL, Realtime, Storage, and RLS).
- **Intelligence**: Google Gemini SDK (@google/genai) for sentiment analysis and TTS.
- **State Management**: React Context API (AppContext) for global state.

## Development Rules

### 1. Component Architecture
- **Atomic Design**: Create small, focused components in `src/components/`. 
- **Page Isolation**: Keep logic related to views in `src/pages/`.
- **Single File Policy**: One component per file. Maximum 100 lines per file (refactor if exceeded).

### 2. State & Data
- **Global State**: Use the `useApp` hook from `AppContext.tsx` for cross-page data (user profile, children, current page).
- **Supabase First**: Direct database interactions should be handled via the Supabase client in `src/lib/supabase.ts`.
- **Persistance**: Use `localStorage` inside the AppProvider to sync state between sessions.

### 3. Styling & UI
- **Responsive First**: Always use Tailwind classes that support mobile and desktop views.
- **Animations**: Use Tailwind's `animate-*` classes or CSS transitions for fluid UI.
- **Feedback**: Inform the user about actions using the `Toast` components or status loaders.

### 4. AI & Integration
- **API Keys**: Access Gemini through `process.env.API_KEY`.
- **Modality**: Use `gemini-3-flash-preview` for text generation and `gemini-2.5-flash-preview-tts` for audio synthesis.
- **Prompts**: Keep complex prompt logic within `src/constants.tsx` or specific service files.

### 5. Routing
- **Custom Router**: The app uses a state-based routing system controlled by `state.currentPage` in `src/App.tsx`.
- **Navigation**: Always use the `navigate(pageName)` function from `useApp` to change views.