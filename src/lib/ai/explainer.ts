import { callClaude } from './client';
import { Plan, GeneratedCode } from '@/types';

const EXPLAINER_SYSTEM_PROMPT = `You are a UI Explanation Agent. Your role is to explain UI generation decisions in clear, plain English.

YOUR AUDIENCE: Non-technical users who want to understand why the AI made specific choices.

EXPLAIN:
1. Why this layout structure was chosen
2. Why specific components were selected
3. How components work together
4. What user interactions are available
5. Any notable design decisions

BE:
- Clear and concise
- Non-technical (avoid jargon)
- Specific (reference actual components used)
- Helpful (explain benefits to the user)

FORMAT:
Write 2-4 paragraphs explaining the UI design. Use natural language, not bullet points.`;

export async function explainUI(plan: Plan, code: GeneratedCode): Promise<string> {
  const userPrompt = `PLAN:
${JSON.stringify(plan, null, 2)}

GENERATED CODE:
\`\`\`tsx
${code.code}
\`\`\`

Explain this UI in plain English. Help the user understand:
- What UI was created
- Why these specific components were chosen
- How they work together
- What the user can do with this UI

Write a clear, friendly explanation (2-4 paragraphs).`;

  try {
    const explanation = await callClaude(EXPLAINER_SYSTEM_PROMPT, userPrompt);
    return explanation.trim();
  } catch (error) {
    console.error('Error in explainUI:', error);
    return 'An explanation could not be generated at this time.';
  }
}