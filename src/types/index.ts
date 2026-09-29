export type WasteCategory =
  | 'Plastic' | 'Paper' | 'Glass' | 'Metal' | 'Organic' | 'E-Waste' | 'Furniture' | 'Mixed'

export type Condition = 'Good' | 'Fair' | 'Poor' | 'Contaminated'
export type RecoveryPotential = 'High' | 'Medium' | 'Low'

export type RecommendedAction =
  | 'Reuse' | 'Repair' | 'Recycle' | 'Upcycle' | 'Compost' | 'E-Waste Facility' | 'Proper Disposal'

export type ReportStatus = 'Reported' | 'Assigned' | 'In Progress' | 'Resolved'

/** Structured result returned by the AI service (demo now, real API later). */
export interface AIAnalysisResult {
  wasteType: string
  category: WasteCategory
  confidence: number // 0-100
  condition: Condition
  recoveryPotential: RecoveryPotential
  recommendedAction: RecommendedAction
  reasoning: string
  isDemo: boolean
}

export interface WasteReport {
  id: string // e.g. EW-1024
  imageUrl?: string
  analysis: AIAnalysisResult
  locationLabel: string
  team: string
  status: ReportStatus
  createdAt: string // ISO
  updatedAt: string // ISO
}

export interface NavItem {
  label: string
  to: string
}
