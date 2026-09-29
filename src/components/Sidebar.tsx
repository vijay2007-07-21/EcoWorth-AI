import { NavLink } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Logo from './Logo'
import { adminNav } from '../data/navigation'
import { cn } from '../utils/cn'

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-forest p-5 text-white">
      <Logo light to="/admin" />
      <nav className="mt-8 flex-1 space-y-1" aria-label="Admin">
        {adminNav.map(({ label, to, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onNavigate}
            className={({ isActive }) =>
              cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-white/10 text-leaf' : 'text-white/70 hover:bg-white/5 hover:text-white')}>
            <Icon className="h-4 w-4" /> {label}
          </NavLink>
        ))}
      </nav>
      <NavLink to="/" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to site
      </NavLink>
    </div>
  )
}
