import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  ExternalLink,
  MapPin,
  PackageCheck,
  Truck,
} from 'lucide-react'

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

const trackingSteps = [
  {
    title: 'Reported',
    description:
      'Waste report submitted successfully.',
    icon: ClipboardCheck,
  },
  {
    title: 'Assigned',
    description:
      'The report is assigned to the responsible team.',
    icon: Truck,
  },
  {
    title: 'In Progress',
    description:
      'The team is working on the reported waste.',
    icon: Clock3,
  },
  {
    title: 'Resolved',
    description:
      'The waste has been handled and the report is closed.',
    icon: PackageCheck,
  },
]

export default function ReportTracking() {
  const [report, setReport] =
    useState<WasteReport | null>(null)

  const loadReport = () => {
    const saved =
      localStorage.getItem(
        'ecoworth-report',
      )

    if (!saved) {
      setReport(null)
      return
    }

    try {
      setReport(
        JSON.parse(saved),
      )
    } catch (error) {
      console.error(
        'Could not load report:',
        error,
      )
      setReport(null)
    }
  }

  useEffect(() => {
    loadReport()

    // Keep tracking synchronized with Admin Dashboard.
    const interval =
      window.setInterval(
        loadReport,
        1000,
      )

    return () => {
      window.clearInterval(
        interval,
      )
    }
  }, [])

  if (!report) {
    return (
      <main className="min-h-screen bg-mint/40 py-12 sm:py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-xl">
            <ClipboardCheck className="mx-auto h-14 w-14 text-gray-300" />

            <h1 className="mt-5 text-3xl font-extrabold text-forest">
              No Report Found
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-gray-500">
              Submit a waste report first to
              start tracking its resolution.
            </p>

            <a
              href="/report"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald px-6 py-3 font-semibold text-white"
            >
              Report Waste
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </main>
    )
  }

  const currentIndex =
    trackingSteps.findIndex(
      (step) =>
        step.title === report.status,
    )

  const googleMapsUrl =
    report.location
      ? `https://www.google.com/maps/search/?api=1&query=${report.location.latitude},${report.location.longitude}`
      : '#'

  return (
    <main className="min-h-screen bg-mint/40 py-12 sm:py-16">
      <div className="container-page">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mx-auto max-w-4xl"
        >
          <span className="eyebrow">
            STEP 5 · RESOLVE
          </span>

          <h1 className="mt-4 text-4xl font-extrabold text-forest sm:text-5xl">
            Report Tracking
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Follow your waste report from
            submission to resolution.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 max-w-5xl">
          {/* Report Summary */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="rounded-3xl bg-white p-6 shadow-xl shadow-emerald/5 sm:p-8"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald">
                  Report ID
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-forest">
                  {report.reportId}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {report.wasteType}
                </p>
              </div>

              <div className="rounded-2xl bg-mint px-5 py-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Current Status
                </p>

                <p className="mt-1 font-bold text-emerald">
                  {report.status}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
            }}
            className="mt-6 rounded-3xl bg-white p-6 shadow-xl shadow-emerald/5 sm:p-8"
          >
            <h2 className="text-xl font-bold text-forest">
              Resolution Timeline
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your report updates automatically
              when the admin changes its status.
            </p>

            <div className="mt-8">
              {trackingSteps.map(
                (
                  step,
                  index,
                ) => {
                  const Icon =
                    step.icon

                  const completed =
                    index <
                    currentIndex

                  const current =
                    index ===
                    currentIndex

                  const future =
                    index >
                    currentIndex

                  return (
                    <div
                      key={
                        step.title
                      }
                      className="relative flex gap-5"
                    >
                      {index <
                        trackingSteps.length -
                          1 && (
                        <div
                          className={`absolute left-[20px] top-11 h-[calc(100%-8px)] w-0.5 ${
                            index <
                            currentIndex
                              ? 'bg-emerald'
                              : 'bg-gray-200'
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                          completed ||
                          current
                            ? 'bg-emerald text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>

                      <div className="pb-8">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3
                            className={`font-bold ${
                              future
                                ? 'text-gray-400'
                                : 'text-forest'
                            }`}
                          >
                            {step.title}
                          </h3>

                          {current && (
                            <span className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-emerald">
                              Current
                            </span>
                          )}

                          {completed && (
                            <span className="text-xs font-semibold text-emerald">
                              Completed
                            </span>
                          )}
                        </div>

                        <p
                          className={`mt-1 text-sm leading-6 ${
                            future
                              ? 'text-gray-400'
                              : 'text-gray-500'
                          }`}
                        >
                          {
                            step.description
                          }
                        </p>
                      </div>
                    </div>
                  )
                },
              )}
            </div>
          </motion.div>

          {/* Report Details */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-emerald/5">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald">
                AI Report
              </p>

              <h2 className="mt-2 text-xl font-bold text-forest">
                Waste Intelligence
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Detail
                  label="Waste Type"
                  value={
                    report.wasteType
                  }
                />

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
                  label="Recovery"
                  value={
                    report.recoveryPotential ||
                    'Unknown'
                  }
                />

                <Detail
                  label="AI Action"
                  value={
                    report.recommendedAction ||
                    'Unknown'
                  }
                />

                <Detail
                  label="Destination"
                  value={
                    report.destination ||
                    'Not selected'
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
            </div>

            {/* Location */}
            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-emerald/5">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald">
                Smart Routing
              </p>

              <h2 className="mt-2 text-xl font-bold text-forest">
                Report Location
              </h2>

              {report.location ? (
                <>
                  <div className="mt-5 rounded-2xl bg-mint p-5">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-emerald" />

                      <div>
                        <p className="font-semibold text-forest">
                          GPS Location Captured
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {report.location.latitude.toFixed(
                            6,
                          )}
                          ,{' '}
                          {report.location.longitude.toFixed(
                            6,
                          )}
                        </p>

                        {report.location
                          .accuracy !==
                          undefined && (
                          <p className="mt-1 text-xs text-gray-400">
                            Accuracy:{' '}
                            {Math.round(
                              report.location
                                .accuracy,
                            )}
                            m
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <a
                    href={
                      googleMapsUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald px-5 py-3 text-sm font-semibold text-white"
                  >
                    <MapPin className="h-4 w-4" />
                    Open in Google Maps
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </>
              ) : (
                <div className="mt-5 rounded-2xl bg-gray-50 p-5 text-sm text-gray-500">
                  Location information is not
                  available.
                </div>
              )}
            </div>
          </div>

          {/* Handling */}
          {report.handling && (
            <div className="mt-6 rounded-3xl bg-white p-6 shadow-xl shadow-emerald/5">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald">
                Handling Instructions
              </p>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                {report.handling}
              </p>
            </div>
          )}

          {/* Final */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
            }}
            className="mt-6 rounded-3xl bg-forest p-7 text-center text-white sm:p-10"
          >
            {report.status ===
            'Resolved' ? (
              <>
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald" />

                <h2 className="mt-4 text-2xl font-extrabold">
                  Waste Report Resolved
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/65">
                  The responsible team has
                  completed the waste-management
                  process.
                </p>
              </>
            ) : (
              <>
                <Truck className="mx-auto h-12 w-12 text-emerald" />

                <h2 className="mt-4 text-2xl font-extrabold">
                  Your report is being processed
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/65">
                  You can keep this page open.
                  The status will update automatically
                  when the admin changes the report.
                </p>
              </>
            )}

            <a
              href="/report"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5"
            >
              Report More Waste
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </main>
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