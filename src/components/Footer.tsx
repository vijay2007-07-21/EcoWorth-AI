import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-forest text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm text-white/70">Turn Waste Into Value. AI-powered waste analysis and smart response.</p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-leaf">Product</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link className="hover:text-white" to="/report">Report Waste</Link></li>
            <li><Link className="hover:text-white" to="/how-it-works">How It Works</Link></li>
            <li><Link className="hover:text-white" to="/tracking">Track a Report</Link></li>
            <li><Link className="hover:text-white" to="/admin">Admin Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-leaf">Team</h3>
          <p className="text-sm text-white/80">M. Vijay</p>
          <p className="text-sm text-white/80">M. Rakhi</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        Hackathon prototype. AI results and statistics shown are demo data.
      </div>
    </footer>
  )
}
