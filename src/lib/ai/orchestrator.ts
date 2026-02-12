import { planUI } from './planner';
import { generateCode } from './generator';
import { explainUI } from './explainer';
import { Plan, GeneratedCode, AgentStep } from '@/types';

export interface OrchestrationResult {
  plan: Plan;
  code: GeneratedCode;
  explanation: string;
  steps: AgentStep[];
}

export async function orchestrateUIGeneration(
  userRequest: string,
  existingCode?: string
): Promise<OrchestrationResult> {
  const steps: AgentStep[] = [];

  try {
    // STEP 1: Planning
    console.log(' Step 1: Planning...');
    const planStart = Date.now();
    const plan = await planUI(userRequest);
    steps.push({
      step: 'planner',
      input: userRequest,
      output: plan,
      timestamp: Date.now() - planStart,
    });

    // STEP 2: Code Generation
    console.log(' Step 2: Generating code...');
    const genStart = Date.now();
    const code = await generateCode(plan, existingCode, existingCode ? userRequest : undefined);
    steps.push({
      step: 'generator',
      input: JSON.stringify(plan),
      output: code,
      timestamp: Date.now() - genStart,
    });

    // STEP 3: Explanation
    console.log(' Step 3: Explaining...');
    const explainStart = Date.now();
    const explanation = await explainUI(plan, code);
    steps.push({
      step: 'explainer',
      input: JSON.stringify({ plan, code }),
      output: explanation,
      timestamp: Date.now() - explainStart,
    });

    // Update code with explanation
    code.explanation = explanation;

    console.log(' Orchestration complete!');

    return {
      plan,
      code,
      explanation,
      steps,
    };
  } catch (error) {
    console.error(' Orchestration failed:', error);
    throw error;
  }
}