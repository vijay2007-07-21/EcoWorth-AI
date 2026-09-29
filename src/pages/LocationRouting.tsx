import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin,
  Navigation,
  Building2,
  Recycle,
  CheckCircle2,
  ArrowRight,
  LocateFixed,
  Route,
  Wrench,
  Leaf,
  RotateCcw,
  PackageOpen,
  Trash2,
  Smartphone,
} from 'lucide-react'
import Button from '../components/Button'

type WasteAnalysis = {
  isWaste: boolean
  wasteType: string
  category: string
  confidence: number
  condition: string
  recoveryPotential: string
  recommendedAction: string
  reason: string
  handling: string
  needsCollection: boolean
}

type Coordinates = {
  latitude: number
  longitude: number
  accuracy: number
}

type Destination = {
  name: string
  type: string
  description: string
  icon: any
}

const destinations: Destination[] = [
  {
    name: 'Recycling Facility',
    type: 'Recyclable Materials',
    description:
      'Suitable for plastic, paper, cardboard, glass and metal recovery.',
    icon: Recycle,
  },
  {
    name: 'E-Waste Collection Center',
    type: 'Electronic Waste',
    description:
      'For phones, laptops, batteries, chargers and other electronic waste.',
    icon: Smartphone,
  },
  {
    name: 'Composting Facility',
    type: 'Organic Waste',
    description:
      'For food scraps and other suitable biodegradable organic material.',
    icon: Leaf,
  },
  {
    name: 'Repair & Recovery Center',
    type: 'Repair / Recovery',
    description:
      'For damaged items that may still have useful life or recoverable value.',
    icon: Wrench,
  },
  {
    name: 'Local Recovery Center',
    type: 'Reuse & Upcycling',
    description:
      'For items that can be reused, repurposed or upcycled.',
    icon: PackageOpen,
  },
  {
    name: 'Waste Collection Center',
    type: 'General Disposal',
    description:
      'For waste that cannot reasonably be recovered through other paths.',
    icon: Building2,
  },
]

function formatAction(action: string) {
  if (!action) return 'Dispose'

  if (action === 'e_waste_collection') {
    return 'E-Waste Collection'
  }

  return action.charAt(0).toUpperCase() + action.slice(1)
}

function getActionIcon(action: string) {
  switch (action) {
    case 'recycle':
      return Recycle

    case 'e_waste_collection':
      return Smartphone

    case 'compost':
      return Leaf

    case 'repair':
      return Wrench

    case 'reuse':
      return RotateCcw

    case 'upcycle':
      return PackageOpen

    case 'dispose':
    default:
      return Trash2
  }
}

function getRecommendedDestination(action: string) {
  switch (action) {
    case 'recycle':
      return 'Recycling Facility'

    case 'e_waste_collection':
      return 'E-Waste Collection Center'

    case 'compost':
      return 'Composting Facility'

    case 'repair':
      return 'Repair & Recovery Center'

    case 'reuse':
    case 'upcycle':
      return 'Local Recovery Center'

    case 'dispose':
    default:
      return 'Waste Collection Center'
  }
}

export default function LocationRouting() {
  const navigate = useNavigate()

  const [location, setLocation] = useState('')
  const [coordinates, setCoordinates] =
    useState<Coordinates | null>(null)

  const [selectedDestination, setSelectedDestination] = useState('')

  const [locationDetected, setLocationDetected] = useState(false)
  const [locationLoading, setLocationLoading] = useState(true)
  const [locationError, setLocationError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const [analysis, setAnalysis] =
    useState<WasteAnalysis | null>(null)

  /*
   * Load the real Gemini result saved by ReportWaste.tsx.
   */
  useEffect(() => {
    try {
      const savedAnalysis =
        localStorage.getItem('ecoworth-analysis')

      if (!savedAnalysis) {
        console.warn('No EcoWorth AI analysis found.')
        return
      }

      const parsedAnalysis = JSON.parse(savedAnalysis)

      setAnalysis(parsedAnalysis)

      /*
       * Automatically select the destination based on
       * Gemini's recommended action.
       */
      const action =
        parsedAnalysis?.recommendedAction?.toLowerCase() ||
        'dispose'

      setSelectedDestination(
        getRecommendedDestination(action),
      )
    } catch (error) {
      console.error(
        'Could not load EcoWorth AI analysis:',
        error,
      )
    }
  }, [])

  /*
   * Automatically detect location when page opens.
   */
  useEffect(() => {
    detectLocation()
  }, [])

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        'Geolocation is not supported by this browser.',
      )

      setLocationLoading(false)
      return
    }

    setLocationLoading(true)
    setLocationError('')
    setLocationDetected(false)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {
          latitude,
          longitude,
          accuracy,
        } = position.coords

        const detectedCoordinates = {
          latitude,
          longitude,
          accuracy,
        }

        setCoordinates(detectedCoordinates)

        setLocation(
          `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        )

        setLocationDetected(true)
        setLocationLoading(false)
      },

      (error) => {
        setLocationLoading(false)

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          setLocationError(
            'Location permission was denied. Please allow location access in your browser.',
          )
        } else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          setLocationError(
            'Your location could not be determined. Please try again.',
          )
        } else if (
          error.code === error.TIMEOUT
        ) {
          setLocationError(
            'Location detection timed out. Please try again.',
          )
        } else {
          setLocationError(
            'Unable to detect your location. Please try again.',
          )
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    )
  }

  /*
   * Current AI action.
   */
  const recommendedAction =
    analysis?.recommendedAction?.toLowerCase() ||
    'dispose'

  const actionLabel =
    formatAction(recommendedAction)

  const ActionIcon =
    getActionIcon(recommendedAction)

  /*
   * Destination recommended by AI.
   */
  const recommendedDestination =
    getRecommendedDestination(
      recommendedAction,
    )

  /*
   * Selected destination object.
   */
  const selectedDestinationData =
    useMemo(
      () =>
        destinations.find(
          (destination) =>
            destination.name ===
            selectedDestination,
        ),
      [selectedDestination],
    )

  /*
   * Submit the complete EcoWorth report.
   */
  const handleSubmit = () => {
    if (
      !locationDetected ||
      !coordinates ||
      submitted
    ) {
      return
    }

    /*
     * Make sure the latest analysis is available.
     */
    let savedAnalysis: WasteAnalysis | null =
      analysis

    try {
      const storedAnalysis =
        localStorage.getItem(
          'ecoworth-analysis',
        )

      if (storedAnalysis) {
        savedAnalysis =
          JSON.parse(storedAnalysis)
      }
    } catch (error) {
      console.error(
        'Could not read saved AI analysis:',
        error,
      )
    }

    const finalAction =
      savedAnalysis?.recommendedAction ||
      'dispose'

    /*
     * Generate report ID.
     */
    const reportId = `ECO-${Date.now()
      .toString()
      .slice(-6)}`

    /*
     * Complete report object.
     */
    const report = {
      reportId,

      status: 'Reported',

      createdAt:
        new Date().toISOString(),

      wasteType:
        savedAnalysis?.wasteType ||
        savedAnalysis?.category ||
        'Waste Report',

      category:
        savedAnalysis?.category ||
        'Unknown',

      isWaste:
        savedAnalysis?.isWaste ?? true,

      confidence:
        savedAnalysis?.confidence ??
        null,

      condition:
        savedAnalysis?.condition ||
        'Unknown',

      recoveryPotential:
        savedAnalysis?.recoveryPotential ||
        'Unknown',

      recommendedAction:
        finalAction,

      reason:
        savedAnalysis?.reason || '',

      handling:
        savedAnalysis?.handling || '',

      needsCollection:
        savedAnalysis?.needsCollection ??
        true,

      location: {
        latitude:
          coordinates.latitude,

        longitude:
          coordinates.longitude,

        accuracy:
          coordinates.accuracy,
      },

      destination:
        selectedDestination,

      aiRecommendedDestination:
        getRecommendedDestination(
          finalAction,
        ),
    }

    /*
     * Save report ID.
     */
    localStorage.setItem(
      'ecoworth-report-id',
      reportId,
    )

    /*
     * Save waste type.
     */
    localStorage.setItem(
      'ecoworth-waste-type',
      report.wasteType,
    )

    /*
     * Save location.
     */
    localStorage.setItem(
      'ecoworth-location',
      `${coordinates.latitude.toFixed(
        6,
      )}, ${coordinates.longitude.toFixed(6)}`,
    )

    /*
     * Save complete report.
     */
    localStorage.setItem(
      'ecoworth-report',
      JSON.stringify(report),
    )

    setSubmitted(true)

    /*
     * Move to tracking.
     */
    setTimeout(() => {
      navigate(
        `/tracking/${reportId}`,
      )
    }, 800)
  }

  /*
   * If no AI analysis exists.
   */
  if (!analysis) {
    return (
      <main className="min-h-screen bg-mint/40 py-12 sm:py-16">
        <div className="container-page">
          <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-mint">
              <ActionIcon className="h-8 w-8 text-emerald" />
            </div>

            <h1 className="mt-6 text-3xl font-extrabold text-forest">
              AI Analysis Required
            </h1>

            <p className="mt-3 leading-7 text-gray-600">
              EcoWorth AI needs a waste analysis before
              creating a location-based report.
            </p>

            <div className="mt-7 flex justify-center">
              <Button
                size="lg"
                to="/report"
              >
                Analyze Waste
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

          </div>
        </div>
      </main>
    )
  }

  /*
   * Don't route normal objects as waste.
   */
  if (!analysis.isWaste) {
    return (
      <main className="min-h-screen bg-mint/40 py-12 sm:py-16">
        <div className="container-page">

          <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
              <CheckCircle2 className="h-8 w-8 text-amber-500" />
            </div>

            <span className="mt-6 inline-block text-xs font-bold uppercase tracking-widest text-amber-600">
              AI DECISION
            </span>

            <h1 className="mt-3 text-3xl font-extrabold text-forest">
              This does not appear to be waste
            </h1>

            <p className="mt-4 leading-7 text-gray-600">
              EcoWorth AI did not find sufficient evidence
              that this item is discarded waste.
            </p>

            <div className="mt-6 rounded-2xl bg-gray-50 p-5 text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                AI Explanation
              </p>

              <p className="mt-2 leading-6 text-gray-700">
                {analysis.reason}
              </p>
            </div>

            <div className="mt-7 flex justify-center">
              <Button
                size="lg"
                to="/report"
              >
                Analyze Another Image
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

          </div>

        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-mint/40 py-12 sm:py-16">
      <div className="container-page">

        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="eyebrow">
            STEP 4 · ROUTE
          </span>

          <h1 className="mt-4 text-4xl font-extrabold text-forest sm:text-5xl">
            Location & Routing
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            EcoWorth AI uses your location and the
            AI decision to determine the appropriate
            recovery destination.
          </p>
        </motion.div>

        {/* PROGRESS */}
        <div className="mx-auto mt-10 flex max-w-4xl items-center justify-center gap-2 sm:gap-4">

          {[
            ['01', 'Capture'],
            ['02', 'Analyze'],
            ['03', 'Decide'],
            ['04', 'Route'],
            ['05', 'Resolve'],
          ].map(
            ([number, label], index) => (
              <div
                key={number}
                className="flex items-center"
              >
                <div className="flex items-center gap-2">

                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                      index <= 3
                        ? 'bg-emerald text-white'
                        : 'bg-white text-gray-400'
                    }`}
                  >
                    {number}
                  </div>

                  <span
                    className={`hidden text-xs font-semibold sm:block ${
                      index <= 3
                        ? 'text-forest'
                        : 'text-gray-400'
                    }`}
                  >
                    {label}
                  </span>

                </div>

                {index < 4 && (
                  <div className="mx-2 h-px w-4 bg-gray-200 sm:mx-4 sm:w-8" />
                )}
              </div>
            ),
          )}

        </div>

        <div className="mx-auto mt-10 max-w-5xl">

          {/* AI DECISION SUMMARY */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 rounded-3xl bg-forest p-7 text-white shadow-xl sm:p-9"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <ActionIcon className="h-7 w-7 text-green-300" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-green-300">
                    AI RECOMMENDATION
                  </p>

                  <h2 className="mt-1 text-2xl font-extrabold">
                    {actionLabel}
                  </h2>

                  <p className="mt-1 text-sm text-white/60">
                    {analysis.wasteType}
                  </p>
                </div>

              </div>

              <div className="rounded-2xl bg-white/10 px-5 py-4">
                <p className="text-xs text-white/50">
                  AI suggested destination
                </p>

                <p className="mt-1 font-bold text-green-300">
                  {recommendedDestination}
                </p>
              </div>

            </div>
          </motion.div>

          {/* LOCATION + MAP */}
          <div className="grid gap-6 lg:grid-cols-2">

            {/* AUTOMATIC LOCATION */}
            <motion.div
              initial={{
                opacity: 0,
                x: -25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="rounded-3xl bg-white p-7 shadow-xl shadow-emerald/5 sm:p-9"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint">
                <MapPin className="h-7 w-7 text-emerald" />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-forest">
                Your Location
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                EcoWorth AI automatically captures your
                device location for the waste report.
              </p>

              <div className="mt-7 rounded-2xl border border-emerald/20 bg-mint/40 p-5">

                {locationLoading && (
                  <div className="flex items-center gap-3">

                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald border-t-transparent" />

                    <div>
                      <p className="font-semibold text-forest">
                        Detecting your location...
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Please allow location access when
                        your browser asks.
                      </p>
                    </div>

                  </div>
                )}

                {!locationLoading &&
                  locationDetected &&
                  coordinates && (
                    <div>

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                          <LocateFixed className="h-5 w-5 text-emerald" />
                        </div>

                        <div>
                          <p className="font-bold text-forest">
                            Location Captured
                          </p>

                          <p className="mt-1 text-sm text-gray-600">
                            GPS coordinates detected successfully
                          </p>
                        </div>

                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">

                        <div className="rounded-xl bg-white p-4">
                          <p className="text-xs text-gray-400">
                            Latitude
                          </p>

                          <p className="mt-1 break-all font-semibold text-forest">
                            {coordinates.latitude.toFixed(
                              6,
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-4">
                          <p className="text-xs text-gray-400">
                            Longitude
                          </p>

                          <p className="mt-1 break-all font-semibold text-forest">
                            {coordinates.longitude.toFixed(
                              6,
                            )}
                          </p>
                        </div>

                      </div>

                      <div className="mt-4 flex items-center justify-between">

                        <p className="text-xs text-gray-500">
                          Accuracy
                        </p>

                        <p className="text-xs font-semibold text-emerald">
                          Approximately{' '}
                          {Math.round(
                            coordinates.accuracy,
                          )}{' '}
                          meters
                        </p>

                      </div>

                      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald">
                        <CheckCircle2 className="h-4 w-4" />
                        Location ready for report
                      </div>

                    </div>
                  )}

                {!locationLoading &&
                  !locationDetected && (
                    <div>

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                          <MapPin className="h-5 w-5 text-red-500" />
                        </div>

                        <div>
                          <p className="font-bold text-red-600">
                            Location Not Detected
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {locationError}
                          </p>
                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={detectLocation}
                        className="mt-5 rounded-xl bg-emerald px-5 py-3 text-sm font-semibold text-white transition hover:bg-forest"
                      >
                        Try Again
                      </button>

                    </div>
                  )}

              </div>

              {/* PRIVACY */}
              <div className="mt-5 rounded-2xl bg-gray-50 p-5">

                <div className="flex items-start gap-3">

                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald" />

                  <div>

                    <p className="font-semibold text-forest">
                      Location privacy
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Your browser controls location permission.
                      EcoWorth AI uses the captured coordinates
                      for the waste-report workflow.
                    </p>

                  </div>

                </div>

              </div>

            </motion.div>

            {/* MAP PREVIEW */}
            <motion.div
              initial={{
                opacity: 0,
                x: 25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="overflow-hidden rounded-3xl bg-forest shadow-xl"
            >

              <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-gradient-to-br from-forest via-emerald to-forest">

                <div className="absolute inset-0 opacity-10">
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
                      backgroundSize:
                        '40px 40px',
                    }}
                  />
                </div>

                <div className="absolute left-[28%] top-[30%] h-40 w-40 rotate-45 border-l-2 border-dashed border-green-300/70" />

                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="relative text-center text-white"
                >

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur">
                    <MapPin className="h-9 w-9 text-green-300" />
                  </div>

                  <p className="mt-5 text-xs font-bold uppercase tracking-widest text-green-300">
                    LIVE LOCATION
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    Waste Location
                  </h3>

                  <p className="mx-auto mt-2 max-w-xs text-sm text-white/60">
                    {locationDetected
                      ? location
                      : 'Waiting for location permission...'}
                  </p>

                </motion.div>

                <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-black/20 p-4 backdrop-blur">

                  <div className="flex items-center gap-3">

                    <Route className="h-5 w-5 text-green-300" />

                    <div>

                      <p className="text-xs text-white/50">
                        AI selected destination
                      </p>

                      <p className="font-semibold text-white">
                        {selectedDestination}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </motion.div>

          </div>

          {/* DESTINATIONS */}
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
              delay: 0.15,
            }}
            className="mt-6 rounded-3xl bg-white p-7 shadow-xl shadow-emerald/5 sm:p-9"
          >

            <div className="text-center">

              <span className="eyebrow">
                SMART ROUTING
              </span>

              <h2 className="mt-3 text-2xl font-bold text-forest">
                Where Should It Go?
              </h2>

              <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-500">
                EcoWorth AI has selected a destination based on
                the recommended recovery path. You can review or
                change the destination before submitting.
              </p>

            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {destinations.map(
                ({
                  name,
                  type,
                  description,
                  icon: Icon,
                }) => {

                  const selected =
                    selectedDestination ===
                    name

                  const aiRecommended =
                    recommendedDestination ===
                    name

                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() =>
                        setSelectedDestination(
                          name,
                        )
                      }
                      className={`rounded-2xl border p-5 text-left transition-all ${
                        selected
                          ? 'border-emerald bg-mint shadow-md'
                          : 'border-gray-100 bg-gray-50 hover:border-emerald/30'
                      }`}
                    >

                      <div className="flex items-start justify-between">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                          <Icon className="h-5 w-5 text-emerald" />
                        </div>

                        <div className="flex items-center gap-2">

                          {aiRecommended && (
                            <span className="rounded-full bg-emerald px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                              AI Recommended
                            </span>
                          )}

                          {selected && (
                            <CheckCircle2 className="h-5 w-5 text-emerald" />
                          )}

                        </div>

                      </div>

                      <h3 className="mt-5 font-bold text-forest">
                        {name}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-emerald">
                        {type}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-gray-500">
                        {description}
                      </p>

                      {selected && (
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald">
                          <Navigation className="h-4 w-4" />
                          Selected destination
                        </div>
                      )}

                    </button>
                  )
                },
              )}

            </div>

          </motion.div>

          {/* SUBMIT */}
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
              delay: 0.25,
            }}
            className="mt-6 flex flex-col items-center justify-between gap-5 rounded-3xl bg-white p-6 shadow-xl shadow-emerald/5 sm:flex-row sm:p-8"
          >

            <div>

              <p className="font-bold text-forest">
                Ready to create your report?
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {selectedDestinationData?.name ||
                  selectedDestination}
              </p>

              {locationDetected && (
                <p className="mt-1 text-xs text-emerald">
                  ✓ Location captured automatically
                </p>
              )}

              <p className="mt-1 text-xs text-gray-400">
                AI analysis, GPS coordinates and routing
                information will be saved to this report.
              </p>

            </div>

            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={
                !locationDetected ||
                locationLoading ||
                submitted ||
                !selectedDestination
              }
            >

              {submitted
                ? 'Report Submitted'
                : 'Submit Waste Report'}

              {!submitted && (
                <ArrowRight className="h-4 w-4" />
              )}

            </Button>

          </motion.div>

          {/* SUCCESS */}
          {submitted && (
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-6 rounded-3xl border border-emerald/20 bg-mint p-6 text-center"
            >

              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald" />

              <h3 className="mt-4 text-xl font-bold text-forest">
                Waste Report Submitted
              </h3>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-600">
                Your AI analysis, captured location and
                selected routing destination have been added
                to the waste report.
              </p>

              <div className="mt-5 flex justify-center">

                <Button
                  size="lg"
                  onClick={() => {
                    const reportId =
                      localStorage.getItem(
                        'ecoworth-report-id',
                      )

                    if (reportId) {
                      navigate(
                        `/tracking/${reportId}`,
                      )
                    } else {
                      navigate('/tracking')
                    }
                  }}
                >
                  Track Report
                  <ArrowRight className="h-4 w-4" />
                </Button>

              </div>

            </motion.div>
          )}

        </div>
      </div>
    </main>
  )
}