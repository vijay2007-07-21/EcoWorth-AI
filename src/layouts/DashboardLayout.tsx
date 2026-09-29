import {
  BarChart3,
  FileText,
  Leaf,
  LayoutDashboard,
  MapPin,
  Menu,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'

const navigation = [
  {
    name: 'Overview',
    path: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Reports',
    path: '/admin/reports',
    icon: FileText,
  },
  {
    name: 'Analytics',
    path: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Teams',
    path: '/admin/teams',
    icon: Users,
  },
  {
    name: 'Locations',
    path: '/admin/locations',
    icon: MapPin,
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: Settings,
  },
]

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-mint/30">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-forest text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <NavLink
            to="/"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald">
              <Leaf className="h-6 w-6 text-white" />
            </span>

            <div>
              <p className="text-lg font-bold">
                EcoWorth AI
              </p>

              <p className="text-xs text-white/50">
                Admin Dashboard
              </p>
            </div>
          </NavLink>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-white/40">
            Management
          </p>

          <div className="space-y-1">
            {navigation.map(
              ({
                name,
                path,
                icon: Icon,
              }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/admin'}
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-white text-forest shadow-lg'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />

                  <span>{name}</span>
                </NavLink>
              ),
            )}
          </div>
        </nav>

        {/* Bottom Brand */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-5">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">
              EcoWorth AI
            </p>

            <p className="mt-1 text-xs leading-5 text-white/50">
              Turn waste into value through
              intelligent decisions.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="min-h-screen lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
          <div className="flex h-20 items-center justify-between px-5 sm:px-8">
            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="rounded-xl border border-gray-200 bg-white p-2.5 text-forest shadow-sm lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Desktop Title */}
            <div className="hidden lg:block">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald">
                EcoWorth AI
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Waste intelligence & response
              </p>
            </div>

            {/* Right Side */}
            <div className="ml-auto flex items-center gap-3">
              <NavLink
                to="/"
                className="hidden rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-forest transition hover:bg-gray-50 sm:block"
              >
                View Website
              </NavLink>

              <NavLink
                to="/report"
                className="rounded-xl bg-emerald px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald/90"
              >
                Report Waste
              </NavLink>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-5rem)] px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}