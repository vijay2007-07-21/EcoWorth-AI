import { BarChart3, FileText, LayoutDashboard, MapPin, Settings, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { NavItem } from '../types'

export const publicNav: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Report Waste', to: '/report' },
  { label: 'Track Report', to: '/tracking' },
]

export interface SidebarItem extends NavItem {
  icon: LucideIcon
  end?: boolean
}

export const adminNav: SidebarItem[] = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Reports', to: '/admin/reports', icon: FileText },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
  { label: 'Teams', to: '/admin/teams', icon: Users },
  { label: 'Locations', to: '/admin/locations', icon: MapPin },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]
