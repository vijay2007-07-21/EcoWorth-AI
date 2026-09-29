import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Recycle,
  Wrench,
  Leaf,
  Trash2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  PackageOpen,
  Truck,
  RefreshCcw,
} from 'lucide-react'
import Button from '../components/Button'

type WasteAnalysis = {
  isWaste: boolean
  wasteType: string
  category: string
  confidence: number
  condition: string
  recoveryPotential: 'low' | 'medium' | 'high' | string
  recommendedAction:
    | 'reuse'
    | 'repair'
    | 'recycle'
    | 'upcycle'
    | 'compost'
    | 'dispose'
    | 'e_waste_collection'
    | string
  reason: string
  handling: string
  needsCollection: boolean
}

const actions = [
  {
    title: 'Reuse',
    value: 'reuse',
    description: 'Use the item again with little or no modification.',
    icon: RotateCcw,
  },
  {
    title: 'Repair',
    value: 'repair',
    description: 'Restore the item so it can continue serving its purpose.',
    icon: Wrench,
  },
  {
    title: 'Recycle',
    value: 'recycle',
    description:
      'Send recoverable material to the appropriate recycling stream.',
    icon: Recycle,
  },
  {
    title: 'Upcycle',
    value: 'upcycle',
    description:
      'Convert the item into another useful product instead of discarding it.',
    icon: PackageOpen,
  },
  {
    title: 'Compost',
    value: 'compost',
    description:
      'Return suitable organic waste to the natural cycle.',
    icon: Leaf,
  },
  {
    title: 'Dispose',
    value: 'dispose',
    description:
      'Use proper disposal when recovery is not practical.',
    icon: Trash2,
  },
  {
    title: 'E-Waste Collection',
    value: 'e_waste_collection',
    description:
      'Send electronic waste to an appropriate collection or recovery service.',
    icon: Truck,
  },
]

function formatAction(action: string) {
  if (!action) return 'Review'

  if (action === 'e_waste_collection') {
    return 'E-Waste Collection'
  }

  return action.charAt(0).toUpperCase() + action.slice(1)
}

function getActionIcon(action: string) {
  switch (action) {
    case 'reuse':
      return RotateCcw

    case 'repair':
      return Wrench

    case 'recycle':
      return Recycle

    case 'upcycle':
      return PackageOpen

    case 'compost':
      return Leaf

    case 'e_waste_collection':
      return Truck

    case 'dispose':
    default:
      return Trash2
  }
}

function getRecoveryLabel(value: string) {
  if (!value) return 'Unknown'

  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default function Recommendation() {
  const [analysis, setAnalysis] = useState<WasteAnalysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const savedAnalysis = localStorage.getItem('ecoworth-analysis')

      if (savedAnalysis) {
        const parsed = JSON.parse(savedAnalysis)
        setAnalysis(parsed)
      }
    } catch (error) {
      console.error('Failed to load AI analysis:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-mint/40 py-16">
        <div className="container-page flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-emerald/20 border-t-emerald" />

            <p className="mt-5 font-semibold text-forest">
              Loading AI recommendation...
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (!analysis) {
    return (
      <main className="min-h-screen bg-mint/40 py-16">
        <div className="container-page">
          <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl">
            <Sparkles className="mx-auto h-12 w-12 text-emerald" />

            <h1 className="mt-5 text-3xl font-extrabold text-forest">
              No AI analysis found
            </h1>

            <p className="mt-3 text-gray-500">
              Please analyze a waste image first. EcoWorth AI needs the
              analysis result before generating a recommendation.
            </p>

            <div className="mt-7">
              <Button size="lg" to="/report">
                Analyze Waste
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const recommendedAction =
    analysis.recommendedAction?.toLowerCase() || 'dispose'

  const actionLabel = formatAction(recommendedAction)
  const ActionIcon = getActionIcon(recommendedAction)

  const confidence =
    typeof analysis.confidence === 'number'
      ? Math.round(
          analysis.confidence <= 1
            ? analysis.confidence * 100
            : analysis.confidence,
        )
      : 0

  return (
    <main className="min-h-screen bg-mint/40 py-12 sm:py-16">
      <div className="container-page">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="eyebrow">
            STEP 3 · DECIDE
          </span>

          <h1 className="mt-4 text-4xl font-extrabold text-forest sm:text-5xl">
            Smart Recommendation
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            EcoWorth AI evaluates the actual image analysis and recommends
            the most practical next action.
          </p>
        </motion.div>

        {/* PROGRESS */}
        <div className="mx-auto mt-10 flex max-w-3xl items-center justify-center gap-2 sm:gap-4">
          {[
            ['01', 'Capture'],
            ['02', 'Analyze'],
            ['03', 'Decide'],
            ['04', 'Resolve'],
          ].map(([number, label], index) => (
            <div key={number} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                    index <= 2
                      ? 'bg-emerald text-white'
                      : 'bg-white text-gray-400'
                  }`}
                >
                  {number}
                </div>

                <span
                  className={`hidden text-xs font-semibold sm:block ${
                    index <= 2
                      ? 'text-forest'
                      : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>

              {index < 3 && (
                <div className="mx-2 h-px w-5 bg-gray-200 sm:mx-4 sm:w-10" />
              )}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-5xl">

          {/* NOT WASTE */}
          {!analysis.isWaste && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-amber-200 bg-white p-7 shadow-xl sm:p-10"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
                <CheckCircle2 className="h-8 w-8 text-amber-500" />
              </div>

              <div className="mt-6 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                  AI DECISION
                </span>

                <h2 className="mt-3 text-3xl font-extrabold text-forest">
                  This does not appear to be waste
                </h2>

                <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
                  EcoWorth AI could not find sufficient visual evidence that
                  the uploaded item is discarded waste.
                </p>
              </div>

              <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-gray-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  AI Explanation
                </p>

                <p className="mt-2 leading-6 text-gray-700">
                  {analysis.reason ||
                    'The image does not provide sufficient evidence that the object is discarded waste.'}
                </p>
              </div>

              <div className="mt-8 flex justify-center">
                <Button size="lg" to="/report">
                  <RefreshCcw className="h-4 w-4" />
                  Analyze Another Image
                </Button>
              </div>
            </motion.div>
          )}

          {/* WASTE DECISION */}
          {analysis.isWaste && (
            <>
              <div className="grid gap-6 lg:grid-cols-2">

                {/* ANALYSIS SUMMARY */}
                <motion.div
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-3xl bg-white p-7 shadow-xl shadow-emerald/5 sm:p-9"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint">
                      <Sparkles className="h-7 w-7 text-emerald" />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-emerald">
                        AI Analysis
                      </p>

                      <h2 className="mt-1 text-2xl font-bold text-forest">
                        {analysis.wasteType}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Category: {analysis.category}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">

                    {/* CONFIDENCE */}
                    <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                      <span className="text-sm text-gray-500">
                        Confidence
                      </span>

                      <span className="font-bold text-forest">
                        {confidence}%
                      </span>
                    </div>

                    {/* CONDITION */}
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 p-4">
                      <span className="text-sm text-gray-500">
                        Condition
                      </span>

                      <span className="text-right font-bold text-forest">
                        {analysis.condition}
                      </span>
                    </div>

                    {/* RECOVERY */}
                    <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                      <span className="text-sm text-gray-500">
                        Recovery Potential
                      </span>

                      <span className="font-bold text-emerald">
                        {getRecoveryLabel(
                          analysis.recoveryPotential,
                        )}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* RECOMMENDATION */}
                <motion.div
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-3xl bg-forest p-7 text-white shadow-xl sm:p-9"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-green-300">
                    RECOMMENDED ACTION
                  </p>

                  <div className="mt-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10">
                    <ActionIcon className="h-10 w-10 text-green-300" />
                  </div>

                  <h2 className="mt-6 text-4xl font-extrabold">
                    {actionLabel}
                  </h2>

                  <p className="mt-4 leading-7 text-white/70">
                    {analysis.reason}
                  </p>

                  <div className="mt-7 rounded-2xl bg-white/10 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-300" />

                      <span className="font-semibold">
                        Recommended by EcoWorth AI based on the uploaded image.
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* HANDLING */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-6 rounded-3xl bg-white p-7 shadow-xl shadow-emerald/5 sm:p-9"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mint">
                    <ActionIcon className="h-6 w-6 text-emerald" />
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald">
                      HOW TO HANDLE IT
                    </span>

                    <h2 className="mt-2 text-xl font-bold text-forest">
                      Practical handling guidance
                    </h2>

                    <p className="mt-2 leading-7 text-gray-600">
                      {analysis.handling}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* DECISION OPTIONS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 rounded-3xl bg-white p-7 shadow-xl shadow-emerald/5 sm:p-9"
              >
                <div className="text-center">
                  <span className="eyebrow">
                    SMART DECISION ENGINE
                  </span>

                  <h2 className="mt-3 text-2xl font-bold text-forest">
                    Available Recovery Paths
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    EcoWorth AI evaluates possible recovery paths and selects
                    the action most appropriate for the analyzed waste.
                  </p>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {actions.map(
                    ({ title, value, description, icon: Icon }) => {
                      const isRecommended =
                        value === recommendedAction

                      return (
                        <div
                          key={value}
                          className={`rounded-2xl border p-5 transition-all ${
                            isRecommended
                              ? 'border-emerald bg-mint shadow-md'
                              : 'border-gray-100 bg-gray-50'
                          }`}
                        >
                          <Icon
                            className={`h-6 w-6 ${
                              isRecommended
                                ? 'text-emerald'
                                : 'text-gray-500'
                            }`}
                          />

                          <h3 className="mt-4 font-bold text-forest">
                            {title}
                          </h3>

                          <p className="mt-2 text-xs leading-5 text-gray-500">
                            {description}
                          </p>

                          {isRecommended && (
                            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald">
                              <CheckCircle2 className="h-4 w-4" />
                              Recommended
                            </div>
                          )}
                        </div>
                      )
                    },
                  )}
                </div>
              </motion.div>

              {/* NEXT STEP */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.3 }}
                className="mt-6 flex flex-col items-center justify-between gap-5 rounded-3xl bg-white p-6 shadow-xl shadow-emerald/5 sm:flex-row sm:p-8"
              >
                <div>
                  <p className="font-bold text-forest">
                    Recommendation complete
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {analysis.needsCollection
                      ? 'This waste requires collection or intervention. Continue to location and routing.'
                      : 'Continue to location and routing to complete the waste report.'}
                  </p>
                </div>

                <Button size="lg" to="/location">
                  Continue to Routing
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}