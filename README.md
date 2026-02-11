# AI UI Generator - Ryze AI Assignment

An AI-powered UI generator that converts natural language → working React code using a deterministic component library.

##  Quick Start
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

##  Project Structure

See `docs/ARCHITECTURE.md` for detailed architecture overview.

##  AI Agent System

Three-step pipeline:
1. **Planner**: Interprets intent → Structured plan
2. **Generator**: Plan → React code
3. **Explainer**: Explains decisions

##  Core Constraint

Uses a **fixed component library** - components never change. AI can only:
- Select components
- Compose layouts
- Set props
- Provide content

##  Component Library

- Button, Card, Input, Table
- Modal, Sidebar, Navbar, Chart

##  Features

- Natural language UI generation
- Iterative modifications
- Version rollback
- Live preview
- AI explanations

##  Tech Stack

- Next.js 14 + TypeScript
- Tailwind CSS
- Anthropic Claude API
- Zustand (state)
- Monaco Editor

##  Assignment Requirements

-  Multi-step AI agent
-  Deterministic components
-  Iterative edits
-  Explainability
-  Version control

---

Built for Ryze AI Full-Stack Assignment