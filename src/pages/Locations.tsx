import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  ExternalLink,
  MapPin,
  RefreshCw,
  Route,
  Target,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'

type WasteReport = {
  reportId: string
  status: string
  wasteType: string
  category?: string
  destination?: string
  location?: {
    latitude: number
    longitude: number
    accuracy?: number
  }
}

type Facility = {
  id: string
  name: string
  type: string
  description: string
}

const facilities: Facility[] = [
  {
    id: 'FAC-001',
    name: 'Recycling Facility',
    type: 'Recycling',
    description:
      'Handles recyclable plastic, paper, glass and metal waste.',
  },
  {
    id: 'FAC-002',
    name: 'E-Waste Collection Center',
    type: 'E-Waste',
    description:
      'Handles phones, laptops, batteries and other electronic waste.',
  },
  {
    id: 'FAC-003',
    name: 'Composting Facility',
    type: 'Organic',
    description:
      'Handles food scraps and other compostable organic waste.',
  },
  {
    id: 'FAC-004',
    name: 'Waste Collection Center',
    type: 'General Waste',
    description:
      'Handles waste that cannot be recovered through recycling or reuse.',
  },
]

export default function Locations() {
  const [report, setReport] =
    useState<WasteReport | null>(null)

  const loadLocation = () => {
    const savedReport =
      localStorage.getItem(
        'ecoworth-report',
      )

    if (!savedReport) {
      setReport(null)
      return
    }

    try {
      const parsed = JSON.parse(savedReport)
      setReport(parsed)
    } catch (error) {
      console.error(
        'Could not load location data:',
        error,
      )
      setReport(null)
    }
  }

  useEffect(() => {
    loadLocation()

    const handleStorageChange = () => {
      loadLocation()
    }

    window.addEventListener(
      'storage',
      handleStorageChange,
    )

    return () => {
      window.removeEventListener(
        'storage',
        handleStorageChange,
      )
    }
  }, [])

  const coordinates = report?.location

  const mapsUrl = coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`
    : ''

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Locations"
        description="View reporting hotspots, captured GPS coordinates and waste-management destinations."
      />

      {/* =========================
          LOCATION SUMMARY
      ========================= */}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={MapPin}
          label="GPS Reports"
          value={coordinates ? 1 : 0}
        />

        <StatCard
          icon={Target}
          label="Tracked Report"
          value={report ? 1 : 0}
        />

        <StatCard
          icon={CheckCircle2}
          label="Current Status"
          value={
            report?.status || 'No Report'
          }
        />
      </div>

      {/* Refresh */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={loadLocation}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-forest shadow-sm transition hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Location
        </button>
      </div>

      {!report ? (
        /* =========================
           EMPTY STATE
        ========================= */

        <div className="card p-12 text-center">
          <MapPin className="mx-auto h-14 w-14 text-gray-300" />

          <h2 className="mt-5 text-xl font-bold text-forest">
            No Location Data
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Submit a waste report with GPS
            permission enabled. The captured
            location will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* =========================
              REPORT LOCATION
          ========================= */}

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Location Card */}
            <div className="card overflow-hidden">
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-mint text-emerald">
                    <MapPin className="h-5 w-5" />
                  </span>

                  <div>
                    <h2 className="font-bold text-forest">
                      Report Location
                    </h2>

                    <p className="text-sm text-gray-500">
                      GPS coordinates captured
                      from the submitted report.
                    </p>
                  </div>
                </div>
              </div>

              {coordinates ? (
                <div className="p-6">
                  {/* Map Preview */}
                  <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-mint to-green-100">
                    <div className="absolute inset-0 opacity-20">
                      <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,#059669_1px,transparent_1px)] [background-size:24px_24px]" />
                    </div>

                    <div className="relative text-center">
                      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald text-white shadow-xl">
                        <MapPin className="h-8 w-8" />
                      </span>

                      <p className="mt-4 font-bold text-forest">
                        Waste Report Location
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        GPS location captured
                      </p>
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Coordinate
                      label="Latitude"
                      value={coordinates.latitude.toFixed(
                        6,
                      )}
                    />

                    <Coordinate
                      label="Longitude"
                      value={coordinates.longitude.toFixed(
                        6,
                      )}
                    />
                  </div>

                  {coordinates.accuracy !==
                    undefined && (
                    <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        GPS Accuracy
                      </p>

                      <p className="mt-1 font-semibold text-forest">
                        Approximately{' '}
                        {Math.round(
                          coordinates.accuracy,
                        )}
                        m
                      </p>
                    </div>
                  )}

                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald/90"
                  >
                    <MapPin className="h-4 w-4" />
                    Open Location in Google Maps
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ) : (
                <div className="p-10 text-center">
                  <MapPin className="mx-auto h-12 w-12 text-gray-300" />

                  <p className="mt-4 text-sm text-gray-500">
                    This report does not contain
                    GPS coordinates.
                  </p>
                </div>
              )}
            </div>

            {/* Report Summary */}
            <div className="card p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald">
                Report
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-forest">
                {report.wasteType}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {report.reportId}
              </p>

              <div className="mt-6 space-y-4">
                <SummaryRow
                  label="Status"
                  value={report.status}
                />

                <SummaryRow
                  label="Category"
                  value={
                    report.category ||
                    'Not specified'
                  }
                />

                <SummaryRow
                  label="Destination"
                  value={
                    report.destination ||
                    'Not selected'
                  }
                />
              </div>

              {coordinates && (
                <div className="mt-6 rounded-2xl bg-mint p-5">
                  <div className="flex items-center gap-3">
                    <Route className="h-5 w-5 text-emerald" />

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                        Routing Ready
                      </p>

                      <p className="mt-1 text-sm font-semibold text-forest">
                        Location is ready for
                        response routing.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* =========================
              FACILITIES
          ========================= */}

          <div>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-forest">
                Waste Management Facilities
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Available destination types for
                EcoWorth AI routing.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {facilities.map(
                (facility) => {
                  const isSelected =
                    report.destination
                      ?.toLowerCase()
                      .includes(
                        facility.name.toLowerCase(),
                      )

                  return (
                    <div
                      key={facility.id}
                      className={`card p-6 ${
                        isSelected
                          ? 'ring-2 ring-emerald'
                          : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-emerald">
                            <MapPin className="h-6 w-6" />
                          </span>

                          <div>
                            <h3 className="font-bold text-forest">
                              {facility.name}
                            </h3>

                            <p className="mt-1 text-xs text-gray-400">
                              {facility.id}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald">
                            Selected
                          </span>
                        )}
                      </div>

                      <p className="mt-5 text-sm leading-6 text-gray-500">
                        {facility.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                        <span className="text-xs font-semibold text-gray-400">
                          {facility.type}
                        </span>

                        <span className="text-xs font-bold text-emerald">
                          {facility.id}
                        </span>
                      </div>
                    </div>
                  )
                },
              )}
            </div>
          </div>

          {/* Routing Explanation */}
          <div className="card bg-forest p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald">
                  EcoWorth Routing
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Capture → Route → Resolve
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                  The captured GPS location helps
                  connect a waste report with the
                  appropriate recovery or collection
                  destination.
                </p>
              </div>

              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/10">
                <Route className="h-8 w-8 text-emerald" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* =========================
   COMPONENTS
========================= */

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin
  label: string
  value: number | string
}) {
  return (
    <div className="card p-5">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-mint text-emerald">
        <Icon className="h-5 w-5" />
      </span>

      <p className="mt-5 text-2xl font-extrabold text-forest">
        {value}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        {label}
      </p>
    </div>
  )
}

function Coordinate({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-forest">
        {value}
      </p>
    </div>
  )
}

function SummaryRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="max-w-[60%] text-right text-sm font-semibold text-forest">
        {value}
      </span>
    </div>
  )
}