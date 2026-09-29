import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import Button from './Button'
import { publicNav } from '../data/navigation'
import { cn } from '../utils/cn'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-emerald/10 bg-white/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {publicNav.map((item) => (
            <NavLink
              key={item.to} to={item.to} end={item.to === '/'}
              className={({ isActive }) =>
                cn('rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-mint text-emerald' : 'text-gray-600 hover:text-forest')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="secondary" to="/admin">Dashboard</Button>
          <Button to="/report">Report Waste</Button>
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-xl text-forest hover:bg-mint md:hidden"
          onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-emerald/10 bg-white md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
            {publicNav.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}
                className={({ isActive }) =>
                  cn('rounded-lg px-3 py-3 text-sm font-medium', isActive ? 'bg-mint text-emerald' : 'text-gray-700')}>
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2">
              <Button variant="secondary" to="/admin" className="flex-1">Dashboard</Button>
              <Button to="/report" className="flex-1">Report Waste</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
