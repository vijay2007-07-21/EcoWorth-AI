import type { WasteReport } from '../types'
import { mockReports } from '../data/mockReports'

const KEY = 'ecoworth.reports.v1'

export function loadReports(): WasteReport[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as WasteReport[]
  } catch { /* ignore */ }
  return mockReports
}

export function saveReports(reports: WasteReport[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(reports)) } catch { /* ignore */ }
}
