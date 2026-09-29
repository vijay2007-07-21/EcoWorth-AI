import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  MapPin,
} from 'lucide-react'
import Button from '../components/Button'

type WasteAnalysis = {
  isWaste: boolean
  wasteType: string
  category: string
  confidence: number
  condition: string
  recoveryPotential: 'low' | 'medium' | 'high'
  recommendedAction:
    | 'reuse'
    | 'repair'
    | 'recycle'
    | 'upcycle'
    | 'compost'
    | 'dispose'
    | 'e_waste_collection'
  reason: string
  handling: string
  needsCollection: boolean
}

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000'

function formatRecovery(value: string) {
  switch (value) {
    case 'high':
      return 'High Recovery'
    case 'medium':
      return 'Medium Recovery'
    case 'low':
      return 'Low Recovery'
    default:
      return value
  }
}

function formatAction(value: string) {
  switch (value) {
    case 'e_waste_collection':
      return 'E-Waste Collection'
    case 'reuse':
      return 'Reuse'
    case 'repair':
      return 'Repair'
    case 'recycle':
      return 'Recycle'
    case 'upcycle':
      return 'Upcycle'
    case 'compost':
      return 'Compost'
    case 'dispose':
      return 'Dispose Properly'
    default:
      return value
  }
}

function getConfidencePercentage(confidence: number) {
  if (confidence <= 1) {
    return Math.round(confidence * 100)
  }

  return Math.round(confidence)
}

export default function ReportWaste() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedImage, setSelectedImage] =
    useState<string | null>(null)

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  const [fileName, setFileName] = useState('')

  const [isAnalyzing, setIsAnalyzing] =
    useState(false)

  const [showResult, setShowResult] =
    useState(false)

  const [analysis, setAnalysis] =
    useState<WasteAnalysis | null>(null)

  const [error, setError] = useState('')

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10 MB.')
      return
    }

    if (selectedImage) {
      URL.revokeObjectURL(selectedImage)
    }

    const imageUrl = URL.createObjectURL(file)

    setSelectedFile(file)
    setFileName(file.name)
    setSelectedImage(imageUrl)
    setShowResult(false)
    setAnalysis(null)
    setError('')

    localStorage.removeItem('ecoworth-analysis')
  }

  const removeImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage)
    }

    setSelectedImage(null)
    setSelectedFile(null)
    setFileName('')
    setShowResult(false)
    setAnalysis(null)
    setError('')

    localStorage.removeItem('ecoworth-analysis')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const analyzeWaste = async () => {
    if (!selectedFile) {
      setError('Please select an image first.')
      return
    }

    setIsAnalyzing(true)
    setError('')
    setShowResult(false)
    setAnalysis(null)

    try {
      const formData = new FormData()

      formData.append('image', selectedFile)

      console.log(
        '📤 Sending image to EcoWorth AI backend...',
      )

      const response = await fetch(
        `${API_URL}/api/analyze-waste`,
        {
          method: 'POST',
          body: formData,
        },
      )

      console.log(
        '📥 Backend response:',
        response.status,
      )

      let data: any

      try {
        data = await response.json()
      } catch {
        throw new Error(
          'Backend returned an invalid response.',
        )
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            `Backend error (${response.status})`,
        )
      }

      if (!data.analysis) {
        throw new Error(
          'AI analysis was not returned by the backend.',
        )
      }

      const result: WasteAnalysis =
        data.analysis

      console.log(
        '🤖 Gemini analysis:',
        result,
      )

      setAnalysis(result)
      setShowResult(true)

      localStorage.setItem(
        'ecoworth-analysis',
        JSON.stringify(result),
      )

      localStorage.setItem(
        'ecoworth-waste-type',
        result.isWaste
          ? result.wasteType
          : 'Not Waste',
      )

      console.log(
        '✅ AI result saved to localStorage',
      )
    } catch (err) {
      console.error(
        '❌ Waste analysis failed:',
        err,
      )

      if (
        err instanceof TypeError &&
        err.message
          .toLowerCase()
          .includes('fetch')
      ) {
        setError(
          'Cannot connect to the EcoWorth AI backend. Please check the deployed backend URL.',
        )
      } else {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong while analyzing the image.',
        )
      }
    } finally {
      setIsAnalyzing(false)
    }
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
            STEP 1 · CAPTURE
          </span>

          <h1 className="mt-4 text-4xl font-extrabold text-forest sm:text-5xl">
            Report Waste
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Upload or capture a photo of the waste.
            EcoWorth AI will analyze the actual image
            and determine the most suitable next action.
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
            <div
              key={number}
              className="flex items-center"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                    index === 0
                      ? 'bg-emerald text-white'
                      : 'bg-white text-gray-400'
                  }`}
                >
                  {number}
                </div>

                <span
                  className={`hidden text-xs font-semibold sm:block ${
                    index === 0
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

          {/* ERROR */}
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <p className="font-semibold">
                  Analysis failed
                </p>

                <p className="mt-1 text-sm">
                  {error}
                </p>
              </div>
            </motion.div>
          )}

          {/* UPLOAD */}
          {!selectedImage && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-emerald/5 sm:p-10"
            >
              <div
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="group cursor-pointer rounded-3xl border-2 border-dashed border-emerald/20 bg-mint/30 px-6 py-16 text-center transition-all duration-300 hover:border-emerald/50 hover:bg-mint/60 sm:px-10"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-lg">
                  <Upload className="h-9 w-9 text-emerald transition-transform duration-300 group-hover:-translate-y-1" />
                </div>

                <h2 className="mt-6 text-2xl font-bold text-forest">
                  Upload a waste photo
                </h2>

                <p className="mx-auto mt-3 max-w-md text-gray-500">
                  Choose a clear image of the waste you want
                  EcoWorth AI to analyze.
                </p>

                <div className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald px-6 py-3 font-semibold text-white shadow-lg shadow-emerald/20">
                  <ImageIcon className="h-5 w-5" />
                  Choose Image
                </div>

                <p className="mt-5 text-xs text-gray-400">
                  JPG, PNG, WEBP · Maximum 10 MB
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl bg-gray-50 p-5">
                  <Camera className="h-6 w-6 text-emerald" />

                  <h3 className="mt-3 font-bold text-forest">
                    Take a photo
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Capture waste directly from your device camera.
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-5">
                  <Sparkles className="h-6 w-6 text-emerald" />

                  <h3 className="mt-3 font-bold text-forest">
                    AI-powered analysis
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Gemini AI analyzes the actual image and
                    recommends the next action.
                  </p>
                </div>

              </div>
            </motion.div>
          )}

          {/* IMAGE PREVIEW */}
          {selectedImage && !showResult && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="grid gap-6 lg:grid-cols-2"
            >

              <div className="overflow-hidden rounded-3xl bg-white p-4 shadow-xl shadow-emerald/5">

                <div className="relative overflow-hidden rounded-2xl bg-gray-100">

                  <img
                    src={selectedImage}
                    alt="Selected waste"
                    className="h-[380px] w-full object-cover"
                  />

                  <button
                    onClick={removeImage}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
                    aria-label="Remove image"
                  >
                    <X className="h-5 w-5" />
                  </button>

                </div>

                <div className="mt-4 flex items-center gap-3">
                  <ImageIcon className="h-5 w-5 text-emerald" />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-forest">
                      Selected image
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {fileName}
                    </p>
                  </div>
                </div>

              </div>

              <div className="rounded-3xl bg-white p-7 shadow-xl shadow-emerald/5 sm:p-9">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint">
                  <Sparkles className="h-6 w-6 text-emerald" />
                </div>

                <h2 className="mt-5 text-2xl font-bold text-forest">
                  Ready for AI Analysis
                </h2>

                <p className="mt-3 leading-7 text-gray-600">
                  Gemini AI will examine the actual uploaded image
                  and determine the waste type, condition,
                  recovery potential, and recommended action.
                </p>

                <div className="mt-7 space-y-3">
                  {[
                    'Waste identification',
                    'Condition assessment',
                    'Recovery potential',
                    'Recommended action',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl bg-gray-50 p-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-emerald" />

                      <span className="text-sm font-medium text-gray-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Button
                    size="lg"
                    onClick={analyzeWaste}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Gemini is analyzing...
                      </>
                    ) : (
                      <>
                        Analyze Waste
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>

              </div>
            </motion.div>
          )}

          {/* RESULT */}
          {showResult && analysis && (
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-3xl bg-white p-6 shadow-xl shadow-emerald/5 sm:p-10"
            >

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <span className="eyebrow">
                    AI ANALYSIS COMPLETE
                  </span>

                  <h2 className="mt-3 text-3xl font-extrabold text-forest">
                    Waste Analysis Result
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint">
                  <CheckCircle2 className="h-7 w-7 text-emerald" />
                </div>

              </div>

              {/* NOT WASTE */}
              {!analysis.isWaste ? (
                <div className="mt-8">

                  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white">
                      <AlertCircle className="h-8 w-8 text-amber-500" />
                    </div>

                    <h3 className="mt-5 text-2xl font-bold text-forest">
                      This does not appear to be waste
                    </h3>

                    <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-600">
                      Gemini AI could not identify the uploaded image
                      as discarded waste. Try uploading a photo showing
                      an item that is clearly discarded, damaged, used,
                      or ready for disposal/recovery.
                    </p>

                    <div className="mx-auto mt-6 max-w-md rounded-2xl bg-white p-5 text-left">

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          AI confidence
                        </span>

                        <span className="font-bold text-forest">
                          {getConfidencePercentage(
                            analysis.confidence,
                          )}
                          %
                        </span>
                      </div>

                      <div className="mt-4">
                        <p className="text-xs text-gray-500">
                          AI explanation
                        </p>

                        <p className="mt-1 text-sm leading-6 text-gray-700">
                          {analysis.reason}
                        </p>
                      </div>

                    </div>

                    <div className="mt-7 flex justify-center">
                      <Button
                        size="lg"
                        onClick={removeImage}
                      >
                        <RotateCcw className="h-4 w-4" />
                        Analyze Another Image
                      </Button>
                    </div>

                  </div>

                </div>
              ) : (
                <>
                  {/* WASTE RESULT */}
                  <div className="mt-8 grid gap-6 lg:grid-cols-2">

                    <div className="overflow-hidden rounded-2xl bg-gray-100">
                      <img
                        src={selectedImage || undefined}
                        alt="Analyzed waste"
                        className="h-[320px] w-full object-cover"
                      />
                    </div>

                    <div className="space-y-3">

                      <div className="rounded-2xl bg-mint p-5">

                        <p className="text-xs text-gray-500">
                          Detected Waste
                        </p>

                        <p className="mt-1 text-xl font-bold text-forest">
                          {analysis.wasteType}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Category: {analysis.category}
                        </p>

                      </div>

                      <div className="grid grid-cols-2 gap-3">

                        <div className="rounded-2xl bg-gray-50 p-5">

                          <p className="text-xs text-gray-500">
                            Confidence
                          </p>

                          <p className="mt-1 text-xl font-bold text-forest">
                            {getConfidencePercentage(
                              analysis.confidence,
                            )}
                            %
                          </p>

                        </div>

                        <div className="rounded-2xl bg-gray-50 p-5">

                          <p className="text-xs text-gray-500">
                            Condition
                          </p>

                          <p className="mt-1 text-xl font-bold capitalize text-forest">
                            {analysis.condition}
                          </p>

                        </div>

                      </div>

                      <div className="rounded-2xl border border-emerald/10 p-5">

                        <p className="text-xs text-gray-500">
                          Recovery Potential
                        </p>

                        <p className="mt-1 text-xl font-bold text-emerald">
                          {formatRecovery(
                            analysis.recoveryPotential,
                          )}
                        </p>

                      </div>

                      <div className="rounded-2xl bg-forest p-5 text-white">

                        <p className="text-xs text-white/60">
                          Recommended Action
                        </p>

                        <p className="mt-1 text-xl font-bold">
                          ♻ {formatAction(
                            analysis.recommendedAction,
                          )}
                        </p>

                      </div>

                    </div>
                  </div>

                  {/* REASON */}
                  <div className="mt-6 rounded-2xl bg-gray-50 p-5">

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Why this recommendation?
                    </p>

                    <p className="mt-2 leading-7 text-gray-700">
                      {analysis.reason}
                    </p>

                  </div>

                  {/* HANDLING */}
                  <div className="mt-3 rounded-2xl bg-mint/60 p-5">

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Handling Guidance
                    </p>

                    <p className="mt-2 leading-7 text-gray-700">
                      {analysis.handling}
                    </p>

                  </div>

                  {/* COLLECTION */}
                  {analysis.needsCollection && (
                    <div className="mt-3 rounded-2xl border border-emerald/20 bg-white p-5">

                      <div className="flex items-start gap-3">

                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald" />

                        <div>
                          <p className="font-semibold text-forest">
                            Collection may be required
                          </p>

                          <p className="mt-1 text-sm text-gray-600">
                            The next step captures your location
                            and routes this report to the appropriate
                            waste-management destination.
                          </p>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* IMPORTANT:
                      THIS GOES TO /location
                      NOT /recommendation */}
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                    <Button
                      size="lg"
                      to="/location"
                    >
                      Continue to Tracking
                      <ArrowRight className="h-4 w-4" />
                    </Button>

                    <Button
                      size="lg"
                      variant="secondary"
                      onClick={removeImage}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Analyze Another
                    </Button>

                  </div>

                  <p className="mt-5 text-center text-xs text-gray-400">
                    Analysis generated by Gemini AI from the uploaded image.
                  </p>

                </>
              )}

            </motion.div>
          )}

        </div>
      </div>
    </main>
  )
}