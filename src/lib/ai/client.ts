import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Model configuration
export const AI_CONFIG = {
  model: 'claude-sonnet-4-20250514',
  maxTokens: 4000,
  temperature: 0.3, // Lower temperature for more deterministic outputs
};

// Helper function to call Claude
export async function callClaude(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: AI_CONFIG.model,
      max_tokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return content.text;
    }

    throw new Error('Unexpected response type from Claude');
  } catch (error) {
    console.error('Error calling Claude:', error);
    throw error;
  }
}