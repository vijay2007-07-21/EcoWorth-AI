import { motion } from 'framer-motion'
import {
  Camera,
  Brain,
  Lightbulb,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Recycle,
  Wrench,
  Leaf,
  Cpu,
} from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Capture',
    description:
      'Upload or capture a clear photo of the waste you have found.',
    icon: Camera,
  },
  {
    number: '02',
    title: 'Analyze',
    description:
      'Gemini AI examines the image and identifies the waste type, condition and material.',
    icon: Brain,
  },
  {
    number: '03',
    title: 'Decide',
    description:
      'EcoWorth AI determines the most suitable recovery action based on the analysis.',
    icon: Lightbulb,
  },
  {
    number: '04',
    title: 'Route',
    description:
      'If collection is required, the location is captured and routed to the appropriate team.',
    icon: MapPin,
  },
  {
    number: '05',
    title: 'Resolve',
    description:
      'The report can be tracked from reported to assigned, in progress and finally resolved.',
    icon: CheckCircle2,
  },
]

const actions = [
  {
    title: 'Reuse',
    description: 'Keep usable items in circulation instead of throwing them away.',
    icon: Recycle,
  },
  {
    title: 'Repair',
    description: 'Identify items that may have value after repair or restoration.',
    icon: Wrench,
  },
  {
    title: 'Recycle',
    description: 'Send recoverable materials into the appropriate recycling stream.',
    icon: Recycle,
  },
  {
    title: 'Compost',
    description: 'Route suitable organic waste toward composting.',
    icon: Leaf,
  },
]

export default function HowItWorks() {
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
            ECO WORTH AI · HOW IT WORKS
          </span>

          <h1 className="mt-4 text-4xl font-extrabold text-forest sm:text-5xl">
            From Waste Photo to Real-World Action
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            EcoWorth AI goes beyond simply identifying waste. It analyzes
            what the waste is, determines what can be recovered, recommends
            the next action and helps route the issue toward resolution.
          </p>
        </motion.div>

        {/* MAIN FLOW */}
        <section className="mx-auto mt-12 max-w-6xl">
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-emerald/5 sm:p-10">

            <div className="grid gap-6 lg:grid-cols-5">
              {steps.map((step, index) => {
                const Icon = step.icon

                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="relative"
                  >
                    <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint">
                        <Icon className="h-7 w-7 text-emerald" />
                      </div>

                      <div className="mt-5 text-xs font-bold tracking-widest text-emerald">
                        STEP {step.number}
                      </div>

                      <h2 className="mt-2 text-xl font-bold text-forest">
                        {step.title}
                      </h2>

                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        {step.description}
                      </p>
                    </div>

                    {index < steps.length - 1 && (
                      <ArrowRight className="absolute -right-5 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-emerald lg:block" />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CORE IDEA */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-12 max-w-6xl"
        >
          <div className="overflow-hidden rounded-3xl bg-forest p-8 text-white sm:p-12">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

              <div>
                <span className="text-sm font-bold uppercase tracking-widest text-emerald">
                  Our Core Idea
                </span>

                <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                  Don't Just Detect Waste.
                  <span className="block text-emerald">
                    Discover What It's Worth.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl leading-8 text-white/70">
                  Traditional waste systems often stop at identification.
                  EcoWorth AI takes the next step by connecting detection
                  with a practical recovery decision and an actionable
                  response.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald/20">
                    <Cpu className="h-7 w-7 text-emerald" />
                  </div>

                  <div>
                    <p className="font-bold">
                      AI Decision Engine
                    </p>

                    <p className="mt-1 text-sm text-white/60">
                      Analyze → Decide → Recommend → Route
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    'Identify the waste',
                    'Estimate recovery potential',
                    'Recommend the next action',
                    'Determine whether collection is needed',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl bg-white/5 p-3"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald" />

                      <span className="text-sm text-white/80">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.section>

        {/* DECISION TYPES */}
        <section className="mx-auto mt-12 max-w-6xl">
          <div className="text-center">
            <span className="eyebrow">
              SMART DECISIONS
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-forest sm:text-4xl">
              What Can EcoWorth AI Recommend?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              The recommendation depends on the material, visible condition
              and recovery potential identified from the image.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {actions.map((action, index) => {
              const Icon = action.icon

              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-3xl bg-white p-6 shadow-lg shadow-emerald/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint">
                    <Icon className="h-6 w-6 text-emerald" />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-forest">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {action.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* EXAMPLE */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-12 max-w-6xl"
        >
          <div className="rounded-3xl border border-emerald/10 bg-white p-7 shadow-xl shadow-emerald/5 sm:p-10">

            <div className="text-center">
              <span className="eyebrow">
                REAL-WORLD EXAMPLE
              </span>

              <h2 className="mt-4 text-3xl font-extrabold text-forest">
                A Plastic Bottle
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-gray-600">
                Here's how a single waste item can move through the
                EcoWorth AI pipeline.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-4">

              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald">
                  01 · Capture
                </p>

                <p className="mt-2 font-semibold text-forest">
                  User uploads a bottle photo.
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald">
                  02 · Analyze
                </p>

                <p className="mt-2 font-semibold text-forest">
                  AI identifies plastic material and visible condition.
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald">
                  03 · Decide
                </p>

                <p className="mt-2 font-semibold text-forest">
                  Recovery potential is evaluated.
                </p>
              </div>

              <div className="rounded-2xl bg-mint p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald">
                  04 · Action
                </p>

                <p className="mt-2 font-semibold text-forest">
                  Recycle through the appropriate waste stream.
                </p>
              </div>

            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-12 max-w-4xl text-center"
        >
          <div className="rounded-3xl bg-white p-8 shadow-xl shadow-emerald/5 sm:p-12">
            <h2 className="text-3xl font-extrabold text-forest">
              Ready to analyze waste?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-gray-600">
              Upload a photo and let EcoWorth AI determine what should
              happen next.
            </p>

            <div className="mt-7 flex justify-center">
              <a
                href="/report"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald px-7 py-3.5 font-semibold text-white shadow-lg shadow-emerald/20 transition hover:-translate-y-0.5"
              >
                Report Waste
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.section>

      </div>
    </main>
  )
}