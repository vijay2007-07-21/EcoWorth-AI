import { Route, Routes } from 'react-router-dom'

import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'

import Landing from './pages/Landing'
import ReportWaste from './pages/ReportWaste'
import AIAnalysis from './pages/AIAnalysis'
import Recommendation from './pages/Recommendation'
import LocationRouting from './pages/LocationRouting'
import ReportTracking from './pages/ReportTracking'
import HowItWorks from './pages/HowItWorks'

import AdminDashboard from './pages/AdminDashboard'
import Reports from './pages/Reports'
import Analytics from './pages/Analytics'
import Teams from './pages/Teams'
import Locations from './pages/Locations'
import Settings from './pages/Settings'

import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      {/* PUBLIC WEBSITE */}
      <Route element={<PublicLayout />}>
        <Route index element={<Landing />} />

        <Route
          path="report"
          element={<ReportWaste />}
        />

        <Route
          path="analysis"
          element={<AIAnalysis />}
        />

        <Route
          path="recommendation"
          element={<Recommendation />}
        />

        <Route
          path="location"
          element={<LocationRouting />}
        />

        <Route
          path="tracking"
          element={<ReportTracking />}
        />

        <Route
          path="tracking/:reportId"
          element={<ReportTracking />}
        />

        <Route
          path="how-it-works"
          element={<HowItWorks />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />
      </Route>

      {/* ADMIN DASHBOARD */}
      <Route
        path="admin"
        element={<DashboardLayout />}
      >
        <Route
          index
          element={<AdminDashboard />}
        />

        <Route
          path="reports"
          element={<Reports />}
        />

        <Route
          path="analytics"
          element={<Analytics />}
        />

        <Route
          path="teams"
          element={<Teams />}
        />

        <Route
          path="locations"
          element={<Locations />}
        />

        <Route
          path="settings"
          element={<Settings />}
        />
      </Route>
    </Routes>
  )
}