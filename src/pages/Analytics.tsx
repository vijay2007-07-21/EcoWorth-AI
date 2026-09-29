import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Leaf,
  MapPin,
  RefreshCw,
  Recycle,
  TrendingUp,
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

const statusList: ReportStatus[] = [
  'Reported',
  'Assigned',
  'In Progress',
  'Resolved',
]

function formatAction(action?: string) {
  if (!action) return 'Not specified'

  return action
    .replace(/_/g, ' ')
    .replace(
      /\b\w/g,
      (letter) => letter.toUpperCase(),
    )
}

function getConfidence(
  confidence?: number,
) {
  if (confidence === undefined) {
    return null
  }

  return confidence <= 1
    ? Math.round(confidence * 100)
    : Math.round(confidence)
}

export default function Analytics() {
  const [reports, setReports] = useState<
    WasteReport[]
  >([])

  const loadReports = () => {
    const storedReports: WasteReport[] = []

    const savedReport =
      localStorage.getItem(
        'ecoworth-report',
      )

    if (savedReport) {
      try {
        const parsed = JSON.parse(
          savedReport,
        )

        if (parsed?.reportId) {
          storedReports.push(parsed)
        }
      } catch (error) {
        console.error(
          'Failed to load analytics data:',
          error,
        )
      }
    }

    setReports(storedReports)
  }

  useEffect(() => {
    loadReports()

    const handleStorageChange = () => {
      loadReports()
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

  /* =========================
     BASIC STATISTICS
  ========================= */

  const totalReports = reports.length

  const resolvedReports = reports.filter(
    (report) =>
      report.status === 'Resolved',
  ).length

  const activeReports = reports.filter(
    (report) =>
      report.status === 'Assigned' ||
      report.status === 'In Progress',
  ).length

  const pendingReports = reports.filter(
    (report) =>
      report.status === 'Reported',
  ).length

  /* =========================
     RECOVERY STATISTICS
  ========================= */

  const recoveryCounts = useMemo(() => {
    const counts: Record<
      string,
      number
    > = {}

    reports.forEach((report) => {
      const action = formatAction(
        report.recommendedAction,
      )

      counts[action] =
        (counts[action] || 0) + 1
    })

    return Object.entries(counts).sort(
      (a, b) => b[1] - a[1],
    )
  }, [reports])

  /* =========================
     CATEGORY STATISTICS
  ========================= */

  const categoryCounts = useMemo(() => {
    const counts: Record<
      string,
      number
    > = {}

    reports.forEach((report) => {
      const category =
        report.category ||
        'Unknown'

      counts[category] =
        (counts[category] || 0) + 1
    })

    return Object.entries(counts).sort(
      (a, b) => b[1] - a[1],
    )
  }, [reports])

  /* =========================
     STATUS STATISTICS
  ========================= */

  const statusCounts = useMemo(() => {
    return statusList.map(
      (status) => ({
        status,
        count: reports.filter(
          (report) =>
            report.status === status,
        ).length,
      }),
    )
  }, [reports])

  /* =========================
     AVERAGE AI CONFIDENCE
  ========================= */

  const averageConfidence =
    reports.length > 0
      ? Math.round(
          reports.reduce(
            (total, report) =>
              total +
              (getConfidence(
                report.confidence,
              ) || 0),
            0,
          ) / reports.length,
        )
      : 0

  /* =========================
     COLLECTION REPORTS
  ========================= */

  const collectionRequired =
    reports.filter(
      (report) =>
        report.needsCollection === true,
    ).length

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Analytics"
        description="Understand waste patterns, recovery decisions and report resolution using submitted data."
      />

      {/* Refresh */}
      <div className="flex justify-end">
        <button
          onClick={loadReports}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-forest shadow-sm transition hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Analytics
        </button>
      </div>

      {/* =========================
          KPI CARDS
      ========================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={FileText}
          label="Total Reports"
          value={totalReports}
          description="Submitted reports"
        />

        <MetricCard
          icon={Clock}
          label="Active Reports"
          value={activeReports}
          description="Assigned or in progress"
        />

        <MetricCard
          icon={CheckCircle2}
          label="Resolved"
          value={resolvedReports}
          description="Successfully resolved"
        />

        <MetricCard
          icon={TrendingUp}
          label="AI Confidence"
          value={`${averageConfidence}%`}
          description="Average analysis confidence"
        />
      </div>

      {/* =========================
          SECONDARY KPI
      ========================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SmallMetric
          icon={Clock}
          title="Pending"
          value={pendingReports}
          text="Awaiting assignment"
        />

        <SmallMetric
          icon={Truck}
          title="Collection Required"
          value={collectionRequired}
          text="Reports needing collection"
        />

        <SmallMetric
          icon={MapPin}
          title="Locations Captured"
          value={
            reports.filter(
              (report) =>
                !!report.location,
            ).length
          }
          text="Reports with GPS data"
        />
      </div>

      {reports.length === 0 ? (
        /* =========================
           EMPTY STATE
        ========================= */

        <div className="card p-12 text-center">
          <BarChart3 className="mx-auto h-14 w-14 text-gray-300" />

          <h2 className="mt-5 text-xl font-bold text-forest">
            No Analytics Data Yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Submit a waste report to start
            generating EcoWorth AI analytics.
          </p>
        </div>
      ) : (
        <>
          {/* =========================
              CHARTS
          ========================= */}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Status Distribution */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-forest">
                    Resolution Status
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Current report distribution
                  </p>
                </div>

                <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint text-emerald">
                  <BarChart3 className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-6 space-y-5">
                {statusCounts.map(
                  ({
                    status,
                    count,
                  }) => {
                    const percentage =
                      totalReports > 0
                        ? Math.round(
                            (count /
                              totalReports) *
                              100,
                          )
                        : 0

                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-gray-700">
                            {status}
                          </span>

                          <span className="font-bold text-forest">
                            {count}
                          </span>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-emerald transition-all"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <p className="mt-1 text-xs text-gray-400">
                          {percentage}% of reports
                        </p>
                      </div>
                    )
                  },
                )}
              </div>
            </div>

            {/* Recovery Decisions */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-forest">
                    AI Recovery Decisions
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Recommended actions from AI
                  </p>
                </div>

                <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint text-emerald">
                  <Recycle className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {recoveryCounts.length ===
                0 ? (
                  <p className="text-sm text-gray-500">
                    No recovery data available.
                  </p>
                ) : (
                  recoveryCounts.map(
                    ([action, count]) => {
                      const percentage =
                        Math.round(
                          (count /
                            totalReports) *
                            100,
                        )

                      return (
                        <div
                          key={action}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-700">
                              {action}
                            </span>

                            <span className="text-sm font-bold text-forest">
                              {count}
                            </span>
                          </div>

                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-emerald"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      )
                    },
                  )
                )}
              </div>
            </div>
          </div>

          {/* =========================
              WASTE CATEGORIES
          ========================= */}

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-forest">
                  Waste Categories
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Categories identified by AI
                </p>
              </div>

              <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint text-emerald">
                <Leaf className="h-5 w-5" />
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categoryCounts.map(
                ([category, count]) => (
                  <div
                    key={category}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
                  >
                    <p className="text-sm font-semibold text-gray-500">
                      {category}
                    </p>

                    <p className="mt-2 text-3xl font-extrabold text-forest">
                      {count}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {count === 1
                        ? 'report'
                        : 'reports'}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* =========================
              REPORT INSIGHT
          ========================= */}

          <div className="card overflow-hidden">
            <div className="border-b border-gray-100 p-6">
              <h2 className="font-bold text-forest">
                Latest Report Intelligence
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                AI-derived information from the latest submission.
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {reports.map(
                (report) => (
                  <div
                    key={report.reportId}
                    className="p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-bold text-forest">
                            {report.wasteType}
                          </h3>

                          <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-emerald">
                            {report.status}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                          {report.reportId}
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <Insight
                          label="Category"
                          value={
                            report.category ||
                            'Unknown'
                          }
                        />

                        <Insight
                          label="AI Action"
                          value={formatAction(
                            report.recommendedAction,
                          )}
                        />

                        <Insight
                          label="Recovery"
                          value={
                            report.recoveryPotential ||
                            'Unknown'
                          }
                        />
                      </div>
                    </div>
                  </div>
                ),
              )}
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

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof FileText
  label: string
  value: string | number
  description: string
}) {
  return (
    <div className="card p-5">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-mint text-emerald">
        <Icon className="h-5 w-5" />
      </span>

      <p className="mt-5 text-3xl font-extrabold text-forest">
        {value}
      </p>

      <p className="mt-1 font-semibold text-forest">
        {label}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {description}
      </p>
    </div>
  )
}

function SmallMetric({
  icon: Icon,
  title,
  value,
  text,
}: {
  icon: typeof Clock
  title: string
  value: number
  text: string
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-mint text-emerald">
        <Icon className="h-5 w-5" />
      </span>

      <div>
        <p className="text-2xl font-extrabold text-forest">
          {value}
        </p>

        <p className="text-sm font-semibold text-forest">
          {title}
        </p>

        <p className="text-xs text-gray-400">
          {text}
        </p>
      </div>
    </div>
  )
}

function Insight({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="min-w-[130px] rounded-xl bg-gray-50 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold capitalize text-forest">
        {value}
      </p>
    </div>
  )
}