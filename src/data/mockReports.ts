import type { WasteReport } from '../types'

/** DEMO / SAMPLE DATA - not real-world statistics. */
const now = Date.now()
const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString()

export const mockReports: WasteReport[] = [
  {
    id: 'EW-1024',
    analysis: {
      wasteType: 'Plastic Bottle', category: 'Plastic', confidence: 94, condition: 'Good',
      recoveryPotential: 'High', recommendedAction: 'Recycle',
      reasoning: 'Demo analysis: recyclable plastic container in usable condition.', isDemo: true,
    },
    locationLabel: 'Central Park Area', team: 'Recycling Team', status: 'Reported',
    createdAt: hoursAgo(2), updatedAt: hoursAgo(2),
  },
  {
    id: 'EW-1023',
    analysis: {
      wasteType: 'Food Waste', category: 'Organic', confidence: 91, condition: 'Fair',
      recoveryPotential: 'Medium', recommendedAction: 'Compost',
      reasoning: 'Demo analysis: organic material suitable for composting.', isDemo: true,
    },
    locationLabel: 'Market Street', team: 'Composting Team', status: 'Assigned',
    createdAt: hoursAgo(9), updatedAt: hoursAgo(6),
  },
  {
    id: 'EW-1022',
    analysis: {
      wasteType: 'Electronic Waste', category: 'E-Waste', confidence: 89, condition: 'Poor',
      recoveryPotential: 'High', recommendedAction: 'E-Waste Facility',
      reasoning: 'Demo analysis: electronics contain recoverable materials and need specialist handling.', isDemo: true,
    },
    locationLabel: 'Tech Park Gate 2', team: 'E-Waste Team', status: 'Resolved',
    createdAt: hoursAgo(30), updatedAt: hoursAgo(4),
  },
]
