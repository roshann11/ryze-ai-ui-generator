# Architecture Overview

## System Design

This AI UI Generator follows a **deterministic, multi-agent architecture** to ensure reproducible and safe UI generation.

## Core Principles

1. **Determinism**: Fixed component library ensures visual consistency
2. **Multi-Step Reasoning**: Separate AI agents for planning, generation, and explanation
3. **Iterative Awareness**: Modify existing code rather than full regeneration
4. **Safety First**: Validation and whitelisting prevent unsafe outputs

## Component Architecture

### Fixed Component Library (`src/components/ui/`)

All UI components are pre-defined with fixed styling:
- Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart
- Styling is locked and cannot be modified by AI
- Components accept only whitelisted props

### AI Agent System (`src/lib/ai/`)

**Three-step pipeline:**

1. **Planner** (`planner.ts`)
   - Input: User's natural language request
   - Output: Structured plan (JSON)
   - Responsibilities:
     - Interpret intent
     - Select appropriate components
     - Design layout structure
     - Provide reasoning

2. **Generator** (`generator.ts`)
   - Input: Plan from Planner
   - Output: Valid React code
   - Responsibilities:
     - Convert plan to code
     - Use only whitelisted components
     - Ensure syntax correctness
     - Handle incremental edits

3. **Explainer** (`explainer.ts`)
   - Input: Plan + Generated code
   - Output: Plain English explanation
   - Responsibilities:
     - Explain component choices
     - Describe layout decisions
     - Clarify modifications

## Data Flow
```
User Input (Natural Language)
    ↓
Planner Agent → Structured Plan
    ↓
Generator Agent → React Code
    ↓
Explainer Agent → Human Explanation
    ↓
Validation Layer → Safety Checks
    ↓
Live Preview Renderer
```

## State Management

Using Zustand for:
- Chat history
- Generation history (for rollback)
- Current code state
- UI preview state

## Safety & Validation

### Component Whitelist Enforcement
- Parse generated code
- Verify only allowed components used
- Reject invalid outputs

### Prompt Injection Protection
- Sanitize user inputs
- Limit special characters in prompts
- Validate AI outputs before execution

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript
- **Styling**: Tailwind CSS (for fixed components)
- **AI**: Anthropic Claude API
- **State**: Zustand
- **Code Editor**: Monaco Editor
- **Preview**: Custom React renderer

## File Structure
```
src/
├── app/                    # Next.js routes
├── components/
│   ├── ui/                 # Fixed component library (deterministic)
│   ├── editor/             # Code editor interface
│   ├── preview/            # Live preview renderer
│   └── chat/               # Chat interface
├── lib/
│   ├── ai/                 # AI agent implementations
│   ├── validation/         # Safety checks
│   └── store/              # State management
└── types/                  # TypeScript definitions
```

## Known Limitations

1. Component library is limited to 8 components
2. No custom component creation
3. AI may occasionally suggest invalid layouts
4. Preview rendering limited to React components

## Future Improvements

1. Streaming AI responses for better UX
2. Diff view between versions
3. Component schema validation with Zod
4. Replay functionality for debugging
5. Static analysis of generated code