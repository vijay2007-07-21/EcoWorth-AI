import { useEffect, useMemo, useState } from 'react'
import {
  ExternalLink,
  FileText,
  MapPin,
  RefreshCw,
  Search,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'

type ReportStatus =
  | 'Reported'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'

type WasteReport = {
  reportId: string
  status: ReportStatus
  createdAt: string
  wasteType: string
  category?: string
  isWaste?: boolean
  confidence?: number
  condition?: string
  recoveryPotential?: string
  recommendedAction?: string
  reason?: string
  handling?: string
  needsCollection?: boolean
  location?: {
    latitude: number
    longitude: number
    accuracy?: number
  }
  destination?: string
}

const statusOptions = [
  'All',
  'Reported',
  'Assigned',
  'In Progress',
  'Resolved',
]

export default function Reports() {
  const [reports, setReports] = useState<
    WasteReport[]
  >([])

  const [selectedReport, setSelectedReport] =
    useState<WasteReport | null>(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('All')

  const loadReports = () => {
    const saved =
      localStorage.getItem(
        'ecoworth-report',
      )

    if (!saved) {
      setReports([])
      setSelectedReport(null)
      return
    }

    try {
      const report =
        JSON.parse(saved) as WasteReport

      setReports([report])

      setSelectedReport((current) => {
        if (
          current &&
          current.reportId ===
            report.reportId
        ) {
          return report
        }

        return report
      })
    } catch (error) {
      console.error(
        'Could not load reports:',
        error,
      )

      setReports([])
      setSelectedReport(null)
    }
  }

  useEffect(() => {
    loadReports()

    const interval =
      window.setInterval(
        loadReports,
        1000,
      )

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  const filteredReports = useMemo(() => {
    const query =
      search.trim().toLowerCase()

    return reports.filter((report) => {
      const matchesSearch =
        !query ||
        report.reportId
          .toLowerCase()
          .includes(query) ||
        report.wasteType
          .toLowerCase()
          .includes(query) ||
        report.category
          ?.toLowerCase()
          .includes(query)

      const matchesStatus =
        statusFilter === 'All' ||
        report.status ===
          statusFilter

      return (
        matchesSearch &&
        matchesStatus
      )
    })
  }, [
    reports,
    search,
    statusFilter,
  ])

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Reports"
        description="View submitted waste reports, AI recommendations and resolution status."
      />

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Reports"
          value={reports.length}
          icon={FileText}
        />

        <StatCard
          label="Reported"
          value={
            reports.filter(
              (r) =>
                r.status ===
                'Reported',
            ).length
          }
          icon={FileText}
        />

        <StatCard
          label="In Progress"
          value={
            reports.filter(
              (r) =>
                r.status ===
                  'Assigned' ||
                r.status ===
                  'In Progress',
            ).length
          }
          icon={RefreshCw}
        />

        <StatCard
          label="Resolved"
          value={
            reports.filter(
              (r) =>
                r.status ===
                'Resolved',
            ).length
          }
          icon={FileText}
        />
      </div>

      {/* Filters */}
      <div className="card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search report ID, waste type..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {statusOptions.map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setStatusFilter(
                      status,
                    )
                  }
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    statusFilter ===
                    status
                      ? 'bg-emerald text-white'
                      : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            onClick={loadReports}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-forest"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {filteredReports.length ===
      0 ? (
        <div className="card p-12 text-center">
          <FileText className="mx-auto h-14 w-14 text-gray-300" />

          <h2 className="mt-5 text-xl font-bold text-forest">
            No Reports Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Submit a waste report to see
            it here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          {/* Report List */}
          <div className="card overflow-hidden">
            <div className="border-b border-gray-100 p-5">
              <h2 className="font-bold text-forest">
                Submitted Reports
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredReports.length}{' '}
                report
                {filteredReports.length !==
                1
                  ? 's'
                  : ''}{' '}
                found.
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredReports.map(
                (report) => (
                  <button
                    key={
                      report.reportId
                    }
                    type="button"
                    onClick={() =>
                      setSelectedReport(
                        report,
                      )
                    }
                    className={`w-full p-5 text-left transition hover:bg-gray-50 ${
                      selectedReport?.reportId ===
                      report.reportId
                        ? 'bg-mint/40'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-bold text-forest">
                          {report.wasteType}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {report.reportId}
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />

                          <span className="truncate">
                            {report.destination ||
                              'Destination not selected'}
                          </span>
                        </div>
                      </div>

                      <StatusBadge
                        status={
                          report.status
                        }
                      />
                    </div>
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Report Details */}
          {selectedReport && (
            <ReportDetails
              report={
                selectedReport
              }
            />
          )}
        </div>
      )}
    </div>
  )
}

function ReportDetails({
  report,
}: {
  report: WasteReport
}) {
  const confidence =
    report.confidence !==
    undefined
      ? report.confidence <= 1
        ? Math.round(
            report.confidence *
              100,
          )
        : Math.round(
            report.confidence,
          )
      : null

  const mapsUrl =
    report.location
      ? `https://www.google.com/maps/search/?api=1&query=${report.location.latitude},${report.location.longitude}`
      : ''

  return (
    <div className="card p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald">
            Report Details
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-forest">
            {report.wasteType}
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            {report.reportId}
          </p>
        </div>

        <StatusBadge
          status={report.status}
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Detail
          label="Category"
          value={
            report.category ||
            'Unknown'
          }
        />

        <Detail
          label="Condition"
          value={
            report.condition ||
            'Unknown'
          }
        />

        <Detail
          label="Recovery Potential"
          value={
            report.recoveryPotential ||
            'Unknown'
          }
        />

        <Detail
          label="AI Recommendation"
          value={
            report.recommendedAction ||
            'Unknown'
          }
        />

        {confidence !==
          null && (
          <Detail
            label="AI Confidence"
            value={`${confidence}%`}
          />
        )}

        <Detail
          label="Collection"
          value={
            report.needsCollection
              ? 'Required'
              : 'Not required'
          }
        />
      </div>

      {report.reason && (
        <div className="mt-5 rounded-2xl bg-gray-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
            AI Explanation
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            {report.reason}
          </p>
        </div>
      )}

      {report.handling && (
        <div className="mt-4 rounded-2xl bg-mint p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
            Handling Instructions
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            {report.handling}
          </p>
        </div>
      )}

      {/* Location */}
      <div className="mt-5 rounded-2xl border border-gray-100 p-5">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 text-emerald" />

          <div className="min-w-0">
            <p className="font-bold text-forest">
              Report Location
            </p>

            {report.location ? (
              <>
                <p className="mt-1 text-sm text-gray-500">
                  {report.location.latitude.toFixed(
                    6,
                  )}
                  ,{' '}
                  {report.location.longitude.toFixed(
                    6,
                  )}
                </p>

                <a
                  href={
                    mapsUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-emerald hover:underline"
                >
                  Open in Google Maps
                  <ExternalLink className="h-4 w-4" />
                </a>
              </>
            ) : (
              <p className="mt-1 text-sm text-gray-500">
                GPS location not available.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Destination */}
      <div className="mt-4 rounded-2xl bg-gray-50 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
          Routing Destination
        </p>

        <p className="mt-1 font-semibold text-forest">
          {report.destination ||
            'Not selected'}
        </p>
      </div>
    </div>
  )
}

function StatusBadge({
  status,
}: {
  status: ReportStatus
}) {
  const styles: Record<
    ReportStatus,
    string
  > = {
    Reported:
      'bg-amber-50 text-amber-700',
    Assigned:
      'bg-blue-50 text-blue-700',
    'In Progress':
      'bg-purple-50 text-purple-700',
    Resolved:
      'bg-emerald-50 text-emerald',
  }

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number
  icon: typeof FileText
}) {
  return (
    <div className="card p-5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint text-emerald">
        <Icon className="h-5 w-5" />
      </span>

      <p className="mt-4 text-3xl font-bold text-forest">
        {value}
      </p>

      <p className="text-sm text-gray-600">
        {label}
      </p>
    </div>
  )
}

function Detail({
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

      <p className="mt-1 font-semibold capitalize text-forest">
        {value.replace(
          /_/g,
          ' ',
        )}
      </p>
    </div>
  )
}