# Campus Literacy Level / EduElevate Functionality Analysis

## Overview
This repository is a single-page React + Vite application designed as an **instructional coaching workspace** for early literacy classrooms (Pre-K to Grade 2). It combines lesson-planning analysis, observation feedback loops, and student intervention tracking using Gemini models.

## Core Functional Modules

### 1) Console (Dashboard)
- Displays growth-focused summary cards and “Focus Rungs” to frame coaching priorities.
- Includes a **Growth Timeline** action that runs `generateGrowthTrendAnalysis` across lesson and student history and returns metric snapshots + ladder progress.
- Presents “affirmation” style messaging rather than punitive language.

### 2) Optimizer (Lesson Planner)
- Accepts manual lesson text and optional curriculum PDF upload.
- Calls `analyzeLessonPlan` to generate:
  - lesson rating,
  - strengths,
  - growth suggestions,
  - optional TTESS mapping (when TTESS mode is enabled).
- Calls `rewriteLessonPlan` to produce a structured “Distinguished Lesson Plan” with:
  - We Will / I Will statements,
  - misconceptions (issue/cause/correction),
  - phased instructional loop,
  - differentiation,
  - classroom culture moves,
  - bridge plan,
  - exit ticket design.

### 3) Audit (Observation Analyzer)
- Upload workflow pairs a recording with a selected lesson plan.
- `analyzeObservation` returns structured coaching feedback:
  - talk balance (% teacher vs student),
  - evidence quotes + timestamps,
  - misconception review,
  - flow alignment against plan,
  - bridge plan,
  - optional TTESS alignment.
- UI visualizes talk ratio with a pie chart and exposes action-oriented “next move” guidance.

### 4) Roster (Student Management)
- Supports manual student creation and CSV bulk upload (name-first parsing).
- Tracks tiers (1–3), accommodations, behavior plan, ELL and IEP flags.
- Allows score entry per student and trend plotting with a line chart in a modal.
- Supports editing and deleting student profiles.

## AI Integration Design
- Uses `@google/genai` and strongly typed JSON schema responses for every major AI action.
- Prompting is role-based and generally growth-oriented.
- TTESS output is feature-gated by a top-level toggle (`showTTESS`) and conditionally requested in schemas.
- Multiple model tiers are used:
  - `gemini-3-flash-preview` for fast analysis passes,
  - `gemini-3-pro-preview` for richer synthesis/rewrite workflows.

## Data / State Characteristics
- Data is currently **in-memory only** (React state). There is no persistence layer, authentication, or backend API.
- The initial app bootstraps with small hardcoded seed data for students/plans.
- Because plans use `const [plans] = useState(...)` with a no-op setter in the planner, newly rewritten plans are not persisted into the global lesson array.

## Functional Strengths
- Clear end-to-end instructional cycle: **plan → observe → reflect → adjust**.
- Strong use of typed interfaces and response schemas to constrain model output structure.
- UX is intentionally coach-friendly (growth language, bridge plans, quick actions).
- Good visualization primitives for adoption (pie + line charts, modal workflows, tier controls).

## Functional Gaps / Risks
1. **Environment variable mismatch**
   - README instructs `GEMINI_API_KEY`, while runtime code reads `process.env.API_KEY`.
   - This can cause silent API auth failures if users follow README literally.

2. **Observation upload is not truly transcribed yet**
   - The selected media file is captured in UI, but `analyzeObservation` is currently called with placeholder transcript text (`"Audio transcript analysis results..."`) rather than an actual transcription pipeline.

3. **No persistence / multi-user support**
   - All instructional artifacts reset on refresh.
   - Not ready for production coaching teams without storage and auth.

4. **Minimal validation/error handling**
   - Failures typically produce generic alerts (e.g., `"Analysis failed."`).
   - No retry strategy, structured error surfaces, or loading-state guardrails for all edge cases.

5. **Potential brittle CSV parsing**
   - Bulk upload parser only reads first comma-separated token per row and assumes a “Name” header convention.

## Suggested Next Functional Milestones
1. Add a backend (or hosted DB) for users, students, plans, and observation artifacts.
2. Implement real audio/video transcription and pass full transcript context into observation analysis.
3. Align env var naming in code + docs (`GEMINI_API_KEY` vs `API_KEY`).
4. Persist rewritten plans and generated analyses to history for longitudinal trend reliability.
5. Add robust validation (file type/size, schema fallback checks, upload parsing safety).
6. Add automated tests for parser and key state transitions in planner/roster workflows.

