# AI UI Generator

A natural language interface for generating React UIs using a deterministic component system. Built for the Ryze AI assignment.

## Demo

**Live:** [Your deployment URL]  
**Video:** [Demo walkthrough]

## What It Does

Type what you want in plain English, and the system generates working React code using a fixed set of components. You can iterate on the design with follow-up messages, and it modifies the existing code rather than rewriting everything.

The AI uses three separate agents:
1. **Planner** - figures out which components you need and how to arrange them
2. **Generator** - writes the actual React code
3. **Explainer** - tells you what it did and why

Everything uses a locked-down component library (Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart). No custom styling or new components get created during generation.

## Running Locally

```bash
git clone [repo-url]
cd ryze-ai-ui-generator
npm install
```

Add your Anthropic API key to `.env.local`:
```
ANTHROPIC_API_KEY=your_key_here
```

Then:
```bash
npm run dev
```

Open http://localhost:3000

## How It Works

The interface has three panels: chat on the left, code editor in the middle, live preview on the right.

When you type a request like "make a login form", here's what happens:

1. Your input goes to the Planner, which decides you need a Card (container), two Inputs (email/password), and a Button (submit)
2. The Generator writes React code using only those components from the fixed library
3. The Explainer describes what got built
4. Code appears in the editor, preview renders on the right

If you say "add a forgot password link", the Generator modifies the existing code instead of starting over.

Every generation gets saved to history, so you can roll back if something breaks.

## Project Structure

```
src/
├── app/
│   ├── api/generate/route.ts    # API endpoint
│   └── page.tsx                  # Main UI
├── components/
│   ├── ui/                       # The 8 components
│   ├── chat/ChatPanel.tsx
│   ├── editor/CodeEditor.tsx
│   └── preview/LivePreview.tsx
├── lib/
│   ├── ai/
│   │   ├── planner.ts
│   │   ├── generator.ts
│   │   ├── explainer.ts
│   │   └── orchestrator.ts
│   ├── validation/
│   │   └── componentWhitelist.ts
│   └── store/useAppStore.ts
└── types/
```

## Component Library

All eight components are pre-styled with Tailwind. The AI can only use these:

**Button** - Different sizes/variants, click handlers  
**Card** - Containers with optional titles  
**Input** - Text fields with labels and validation  
**Table** - Data tables with custom columns  
**Modal** - Dialogs and popups  
**Sidebar** - Side navigation  
**Navbar** - Top navigation bars  
**Chart** - Basic data visualization  

## Safety

The validation layer blocks:
- Inline styles (`style={{...}}`)
- Dynamic className generation
- Components not in the whitelist
- Prompt injection attempts

If the AI tries to generate something invalid, the validator catches it before rendering.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Anthropic Claude Sonnet 4
- Tailwind CSS
- Zustand (state)
- Monaco Editor

## Limitations

The component library is intentionally limited. Complex UIs might need multiple iterations to get right. Generated components don't share state with each other (they use local state only).

The AI occasionally suggests layouts that don't quite work - the validator catches most of these, but you might need to rephrase your request.

## What I'd Add Next

With more time, I'd implement:
- Response streaming for better feedback
- Visual diff between versions
- More component variants (different button styles, table layouts, etc.)
- Better error recovery when the AI makes mistakes
- Export to standalone project

## Testing

Try these:

```
"Create a login form"
"Build a dashboard with a table and navbar"
"Make it more minimal" (after generating something)
"Add a modal for user settings"
"Change the button to red" - should work
"Use Material-UI" - should reject
```

The system should handle normal requests and reject anything trying to break the component restrictions.

## Deployment

Works on Vercel out of the box:

```bash
vercel
vercel env add ANTHROPIC_API_KEY
```

Set your API key in the Vercel dashboard under environment variables.

---

Built as part of the Ryze AI technical assessment.
