import { NextRequest, NextResponse } from 'next/server';
import { orchestrateUIGeneration } from '@/lib/ai/orchestrator';

export async function POST(request: NextRequest) {
  try {
    const { userRequest, existingCode } = await request.json();

    if (!userRequest || typeof userRequest !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: userRequest is required' },
        { status: 400 }
      );
    }

    // Orchestrate the 3-step AI pipeline
    const result = await orchestrateUIGeneration(userRequest, existingCode);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate UI',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}