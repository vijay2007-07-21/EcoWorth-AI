import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { cn } from '../utils/cn'

export default function Logo({ light = false, to = '/' }: { light?: boolean; to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2.5" aria-label="EcoWorth AI home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-leaf shadow-soft">
        <Leaf className="h-5 w-5" />
      </span>
      <span className={cn('font-display text-lg font-bold', light ? 'text-white' : 'text-forest')}>
        EcoWorth <span className="text-emerald">AI</span>
      </span>
    </Link>
  )
}
