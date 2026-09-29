import type { AIAnalysisResult } from '../types'

/**
 * AI service boundary.
 * Stage 1: stub only. Stage 4 adds DEMO analysis cases.
 * Later: replace the body with a fetch() to the FastAPI backend (VITE_API_BASE_URL).
 * The UI depends only on this function's signature.
 */
export async function analyzeWaste(_image?: File | string): Promise<AIAnalysisResult> {
  return {
    wasteType: 'Plastic Bottle',
    category: 'Plastic',
    confidence: 94,
    condition: 'Good',
    recoveryPotential: 'High',
    recommendedAction: 'Recycle',
    reasoning: 'DEMO analysis (no real model running): placeholder result.',
    isDemo: true,
  }
}
