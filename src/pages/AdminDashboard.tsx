import { useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
  Clock,
  FileText,
  Loader,
  MapPin,
  RefreshCw,
  Truck,
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

const statuses: ReportStatus[] = [
  'Reported',
  'Assigned',
  'In Progress',
  'Resolved',
]

export default function AdminDashboard() {
  const [reports, setReports] = useState<
    WasteReport[]
  >([])

  const [selectedReport, setSelectedReport] =
    useState<WasteReport | null>(null)

  const [updating, setUpdating] =
    useState(false)

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
      const report = JSON.parse(
        saved,
      ) as WasteReport

      setReports([report])

      setSelectedReport((current) => {
        if (
          current?.reportId ===
          report.reportId
        ) {
          return report
        }

        return report
      })
    } catch (error) {
      console.error(
        'Could not load report:',
        error,
      )

      setReports([])
      setSelectedReport(null)
    }
  }

  useEffect(() => {
    loadReports()

    const interval = window.setInterval(
      loadReports,
      1000,
    )

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  const updateStatus = (
    status: ReportStatus,
  ) => {
    if (!selectedReport) return

    setUpdating(true)

    const updatedReport: WasteReport = {
      ...selectedReport,
      status,
    }

    localStorage.setItem(
      'ecoworth-report',
      JSON.stringify(updatedReport),
    )

    setSelectedReport(updatedReport)
    setReports([updatedReport])

    setTimeout(() => {
      setUpdating(false)
    }, 400)
  }

  const count = (
    status: ReportStatus,
  ) =>
    reports.filter(
      (report) =>
        report.status === status,
    ).length

  const stats = useMemo(
    () => [
      {
        label: 'Total Reports',
        value: reports.length,
        icon: FileText,
      },
      {
        label: 'Pending',
        value: count('Reported'),
        icon: Clock,
      },
      {
        label: 'In Progress',
        value:
          count('Assigned') +
          count('In Progress'),
        icon: Loader,
      },
      {
        label: 'Resolved',
        value: count('Resolved'),
        icon: CheckCircle2,
      },
    ],
    [reports],
  )

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Waste Management Dashboard"
        description="Monitor submitted waste reports and update their resolution status."
      />

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(
          ({
            label,
            value,
            icon: Icon,
          }) => (
            <div
              key={label}
              className="card p-5"
            >
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
          ),
        )}
      </div>

      {/* Refresh */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={loadReports}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-forest transition hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Reports
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="mx-auto h-14 w-14 text-gray-300" />

          <h2 className="mt-5 text-xl font-bold text-forest">
            No Reports Yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Submit a waste report from the
            public website and it will appear
            here automatically.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Reports */}
          <div className="card overflow-hidden">
            <div className="border-b border-gray-100 p-5">
              <h2 className="font-bold text-forest">
                Submitted Reports
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select a report to manage it.
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {reports.map(
                (report) => (
                  <button
                    key={report.reportId}
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
                      <div>
                        <h3 className="font-bold text-forest">
                          {report.wasteType}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {report.reportId}
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                          <MapPin className="h-3.5 w-3.5" />
                          {report.destination ||
                            'Destination not selected'}
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

          {/* Details */}
          {selectedReport && (
            <div className="card p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald">
                    Report Details
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold text-forest">
                    {selectedReport.wasteType}
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    {selectedReport.reportId}
                  </p>
                </div>

                <StatusBadge
                  status={
                    selectedReport.status
                  }
                />
              </div>

              {/* Details */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Detail
                  label="Category"
                  value={
                    selectedReport.category ||
                    'Unknown'
                  }
                />

                <Detail
                  label="Condition"
                  value={
                    selectedReport.condition ||
                    'Unknown'
                  }
                />

                <Detail
                  label="Recovery"
                  value={
                    selectedReport.recoveryPotential ||
                    'Unknown'
                  }
                />

                <Detail
                  label="AI Recommendation"
                  value={
                    selectedReport.recommendedAction ||
                    'Unknown'
                  }
                />

                <Detail
                  label="Destination"
                  value={
                    selectedReport.destination ||
                    'Not selected'
                  }
                />

                <Detail
                  label="Collection"
                  value={
                    selectedReport.needsCollection
                      ? 'Required'
                      : 'Not required'
                  }
                />
              </div>

              {/* AI Reason */}
              {selectedReport.reason && (
                <div className="mt-5 rounded-2xl bg-gray-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    AI Explanation
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {selectedReport.reason}
                  </p>
                </div>
              )}

              {/* Status Management */}
              <div className="mt-6 rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-emerald" />

                  <div>
                    <p className="font-bold text-forest">
                      Update Report Status
                    </p>

                    <p className="text-xs text-gray-500">
                      Changes are immediately saved
                      for the tracking page.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {statuses.map(
                    (status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={
                          updating
                        }
                        onClick={() =>
                          updateStatus(
                            status,
                          )
                        }
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                          selectedReport.status ===
                          status
                            ? 'border-emerald bg-mint text-emerald'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {selectedReport.status ===
                        status
                          ? `✓ ${status}`
                          : status}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Location */}
              {selectedReport.location && (
                <div className="mt-5 rounded-2xl bg-mint p-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-emerald" />

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                        GPS Location
                      </p>

                      <p className="mt-1 text-sm font-semibold text-forest">
                        {selectedReport.location.latitude.toFixed(
                          6,
                        )}
                        ,{' '}
                        {selectedReport.location.longitude.toFixed(
                          6,
                        )}
                      </p>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedReport.location.latitude},${selectedReport.location.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs font-bold text-emerald hover:underline"
                      >
                        Open in Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
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
      className={`rounded-full px-3 py-1.5 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
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
        {value.replace(/_/g, ' ')}
      </p>
    </div>
  )
}