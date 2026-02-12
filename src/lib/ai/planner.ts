import { callClaude } from './client';
import { sanitizeUserInput } from '../validation/ComponentWhitelist';
import { Plan } from '@/types';

const PLANNER_SYSTEM_PROMPT = `You are a UI Planning Agent. Your role is to interpret user intent and create a structured plan for UI generation.

ALLOWED COMPONENTS (you can ONLY use these):
- Button: Interactive button with variants (primary, secondary, outline, ghost)
- Card: Container with optional title and description
- Input: Text input field with label and validation
- Table: Data table with columns and rows
- Modal: Popup dialog with header and footer
- Sidebar: Side navigation panel
- Navbar: Top navigation bar
- Chart: Data visualization (bar, line, pie)

RULES:
1. You must ONLY select from the allowed components above
2. You cannot create new components or suggest custom styling
3. Focus on layout structure and component composition
4. Consider responsive design principles
5. Think about user experience and accessibility

OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "layout": {
    "type": "single" | "split" | "grid" | "sidebar",
    "sections": [
      {
        "id": "section-1",
        "area": "main" | "sidebar" | "header" | "footer",
        "components": ["component-1", "component-2"]
      }
    ]
  },
  "components": [
    {
      "id": "component-1",
      "componentType": "Button",
      "purpose": "Submit form data",
      "props": {
        "variant": "primary",
        "children": "Submit"
      }
    }
  ],
  "reasoning": "I chose a split layout because... The navbar provides navigation... etc."
}

Be specific and detailed in your reasoning.`;

export async function planUI(userRequest: string): Promise<Plan> {
  const sanitizedRequest = sanitizeUserInput(userRequest);

  const userPrompt = `User request: "${sanitizedRequest}"

Create a detailed plan for this UI. Consider:
1. What layout structure makes sense?
2. Which components should be used and why?
3. How should they be arranged?
4. What props should each component have?

Return ONLY valid JSON matching the specified format.`;

  try {
    const response = await callClaude(PLANNER_SYSTEM_PROMPT, userPrompt);

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/) || response.match(/({[\s\S]*})/);
    const jsonStr = jsonMatch ? jsonMatch[1] : response;

    const planData = JSON.parse(jsonStr);

    // Create Plan object with proper structure
    const plan: Plan = {
      id: `plan-${Date.now()}`,
      timestamp: Date.now(),
      layout: planData.layout,
      components: planData.components,
      reasoning: planData.reasoning,
    };

    return plan;
  } catch (error) {
    console.error('Error in planUI:', error);
    throw new Error('Failed to create UI plan');
  }
}