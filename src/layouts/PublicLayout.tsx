import { Leaf, Menu, X } from 'lucide-react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { useState } from 'react'

const navigation = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'How It Works',
    path: '/how-it-works',
  },
  {
    name: 'Report Waste',
    path: '/report',
  },
  {
    name: 'Track Report',
    path: '/tracking',
  },
]

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-forest">
      {/* Mobile overlay */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest">
              <Leaf className="h-6 w-6 text-emerald" />
            </span>

            <span className="text-xl font-extrabold tracking-tight text-forest">
              EcoWorth AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navigation.map(
              ({ name, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-mint text-emerald'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-forest'
                    }`
                  }
                >
                  {name}
                </NavLink>
              ),
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 sm:flex">
            {/* IMPORTANT: absolute admin route */}
            <Link
              to="/admin"
              className="rounded-xl border border-emerald/20 bg-white px-5 py-2.5 text-sm font-semibold text-forest transition hover:bg-mint"
            >
              Dashboard
            </Link>

            <Link
              to="/report"
              className="rounded-xl bg-emerald px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald/90"
            >
              Report Waste
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-xl border border-gray-200 p-2.5 text-forest sm:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm bg-white shadow-2xl sm:hidden">
          <div className="flex h-20 items-center justify-between border-b border-gray-100 px-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest">
                <Leaf className="h-5 w-5 text-emerald" />
              </span>

              <span className="font-bold text-forest">
                EcoWorth AI
              </span>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-2 p-5">
            {navigation.map(
              ({ name, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-sm font-semibold ${
                      isActive
                        ? 'bg-mint text-emerald'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  {name}
                </NavLink>
              ),
            )}

            {/* IMPORTANT: absolute admin route */}
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="mt-4 block rounded-xl border border-emerald/20 px-4 py-3 text-center text-sm font-semibold text-forest"
            >
              Dashboard
            </Link>

            <Link
              to="/report"
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl bg-emerald px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Report Waste
            </Link>
          </nav>
        </div>
      )}

      {/* Page */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-forest text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            {/* Brand */}
            <div>
              <Link
                to="/"
                className="flex items-center gap-3"
              >
                <Leaf className="h-6 w-6 text-emerald" />

                <span className="text-xl font-extrabold">
                  EcoWorth AI
                </span>
              </Link>

              <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
                Turn Waste Into Value. AI-powered
                waste analysis and smart response.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-emerald">
                Product
              </p>

              <div className="mt-5 space-y-3 text-sm">
                <Link
                  to="/report"
                  className="block text-white/75 transition hover:text-white"
                >
                  Report Waste
                </Link>

                <Link
                  to="/how-it-works"
                  className="block text-white/75 transition hover:text-white"
                >
                  How It Works
                </Link>

                <Link
                  to="/tracking"
                  className="block text-white/75 transition hover:text-white"
                >
                  Track a Report
                </Link>

                {/* IMPORTANT: absolute admin route */}
                <Link
                  to="/admin"
                  className="block text-white/75 transition hover:text-white"
                >
                  Admin Dashboard
                </Link>
              </div>
            </div>

            {/* Team */}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-emerald">
                Team
              </p>

              <div className="mt-5 space-y-2 text-sm text-white/75">
                <p>M. Vijay</p>
                <p>M. Rakhi</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-5 py-5 text-center text-xs text-white/50 sm:px-8">
            Hackathon prototype. AI results and
            statistics shown are demo data.
          </div>
        </div>
      </footer>
    </div>
  )
}
