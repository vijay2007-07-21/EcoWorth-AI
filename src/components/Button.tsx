import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  to?: string
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-emerald text-white shadow-soft hover:bg-forest',
  secondary: 'border border-emerald/20 bg-white text-forest hover:bg-mint',
  ghost: 'text-forest hover:bg-mint',
}
const sizes: Record<Size, string> = { md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3.5 text-base' }

export default function Button({ variant = 'primary', size = 'md', to, className, children, ...rest }: Props) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200',
    'active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant], sizes[size], className,
  )
  if (to) return <Link to={to} className={classes}>{children}</Link>
  return <button className={classes} {...rest}>{children}</button>
}
