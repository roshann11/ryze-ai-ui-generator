import { callClaude } from './client';
import { validateComponentUsage } from '../validation/ComponentWhitelist';
import { Plan, GeneratedCode } from '@/types';

const GENERATOR_SYSTEM_PROMPT = `You are a React Code Generator. You convert structured UI plans into valid, executable React code.

CRITICAL RULES:
1. You can ONLY import and use these components from '@/components/ui':
   - Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart

2. PROHIBITED:
   - Creating new components
   - Inline styles (style={{...}})
   - Dynamic className generation
   - External libraries
   - Custom CSS

3. REQUIRED:
   - All imports must be from '@/components/ui'
   - Use TypeScript with proper typing
   - Use React hooks (useState, useEffect) when needed
   - Export a default function component

4. CODE STRUCTURE:
   - Start with imports
   - Define interfaces for props/state if needed
   - Create the main component function
   - Export default

EXAMPLE OUTPUT:
\`\`\`tsx
import React, { useState } from 'react';
import { Button, Card, Input } from '@/components/ui';

export default function GeneratedUI() {
  const [value, setValue] = useState('');

  return (
    <div className="p-8">
      <Card title="Welcome" description="This is a generated UI">
        <Input
          label="Enter text"
          value={value}
          onChange={setValue}
          fullWidth
        />
        <Button variant="primary" onClick={() => console.log(value)}>
          Submit
        </Button>
      </Card>
    </div>
  );
}
\`\`\`

Your output must be production-ready, valid React/TypeScript code.`;

export async function generateCode(plan: Plan, existingCode?: string, modificationRequest?: string): Promise<GeneratedCode> {
  let userPrompt: string;

  if (existingCode && modificationRequest) {
    // INCREMENTAL EDIT MODE
    userPrompt = `EXISTING CODE:
\`\`\`tsx
${existingCode}
\`\`\`

MODIFICATION REQUEST: "${modificationRequest}"

PLAN:
${JSON.stringify(plan, null, 2)}

TASK: Modify the existing code according to the modification request and plan.
- PRESERVE existing functionality where possible
- Only change what's necessary
- Maintain the same component structure
- Do NOT rewrite everything from scratch

Return the COMPLETE modified code (not just changes).`;
  } else {
    // INITIAL GENERATION MODE
    userPrompt = `PLAN:
${JSON.stringify(plan, null, 2)}

TASK: Generate complete, valid React code that implements this plan exactly.
- Use only the allowed components
- Follow the layout structure
- Apply the specified props
- Make it functional and interactive where appropriate

Return ONLY the complete React component code wrapped in \`\`\`tsx code blocks.`;
  }

  try {
    const response = await callClaude(GENERATOR_SYSTEM_PROMPT, userPrompt);

    // Extract code from markdown code blocks
    const codeMatch = response.match(/```tsx\n?([\s\S]*?)\n?```/) || response.match(/```typescript\n?([\s\S]*?)\n?```/);
    const code = codeMatch ? codeMatch[1].trim() : response.trim();

    // Validate the generated code
    const validation = validateComponentUsage(code);
    if (!validation.isValid) {
      throw new Error(`Code validation failed: ${validation.violations.join(', ')}`);
    }

    const generatedCode: GeneratedCode = {
      id: `code-${Date.now()}`,
      planId: plan.id,
      code,
      timestamp: Date.now(),
      explanation: '', // Will be filled by explainer
    };

    return generatedCode;
  } catch (error) {
    console.error('Error in generateCode:', error);
    throw error;
  }
}