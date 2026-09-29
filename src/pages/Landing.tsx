import { motion } from 'framer-motion'
import {
  ArrowRight,
  Camera,
  Cpu,
  Route,
  ScanSearch,
  CheckCircle2,
  Recycle,
  Wrench,
  Leaf,
  Smartphone,
  MapPin,
  BarChart3,
  BrainCircuit,
  ShieldCheck,
} from 'lucide-react'
import Button from '../components/Button'

const flow = [
  { label: 'Capture', icon: Camera },
  { label: 'Analyze', icon: ScanSearch },
  { label: 'Decide', icon: Cpu },
  { label: 'Route', icon: Route },
  { label: 'Resolve', icon: CheckCircle2 },
]

const wasteExamples = [
  {
    title: 'Plastic Bottle',
    condition: 'Good condition',
    recovery: 'High recovery',
    action: 'Recycle',
    icon: Recycle,
  },
  {
    title: 'Old Chair',
    condition: 'Damaged but usable',
    recovery: 'High recovery',
    action: 'Repair / Reuse',
    icon: Wrench,
  },
  {
    title: 'Food Waste',
    condition: 'Organic material',
    recovery: 'High recovery',
    action: 'Compost',
    icon: Leaf,
  },
  {
    title: 'Electronic Device',
    condition: 'Non-functional',
    recovery: 'Special handling',
    action: 'E-Waste Collection',
    icon: Smartphone,
  },
]

const features = [
  {
    icon: BrainCircuit,
    title: 'AI Waste Analysis',
    description:
      'Identify waste type, material, condition, and recovery potential from an uploaded image.',
  },
  {
    icon: Recycle,
    title: 'Smart Recommendations',
    description:
      'Recommend whether waste should be reused, repaired, recycled, composted, or disposed.',
  },
  {
    icon: MapPin,
    title: 'Location-Based Reporting',
    description:
      'Attach location information when a waste report requires collection or intervention.',
  },
  {
    icon: Route,
    title: 'Resolution Tracking',
    description:
      'Follow reports from submitted to assigned, in progress, and finally resolved.',
  },
  {
    icon: BarChart3,
    title: 'Waste Analytics',
    description:
      'Understand waste categories, recurring patterns, recovery opportunities, and hotspots.',
  },
  {
    icon: ShieldCheck,
    title: 'Action-Oriented Platform',
    description:
      'Move beyond simple detection by connecting AI insights with practical next actions.',
  },
]

export default function Landing() {
  return (
    <main className="overflow-hidden bg-white">

      {/* HERO */}
      <section className="relative overflow-hidden bg-mint/60">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald/10 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-green-200/30 blur-3xl" />

        <div className="container-page relative py-20 sm:py-28 lg:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-2">

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="eyebrow">
                AI-POWERED WASTE INTELLIGENCE
              </span>

              <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight text-forest sm:text-6xl lg:text-7xl">
                Don't Just Detect Waste.
                <span className="block text-emerald">
                  Discover What It's Worth.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600 sm:text-xl">
                EcoWorth AI transforms a simple waste photo into an intelligent
                action plan — helping identify waste, evaluate recovery
                potential, recommend the right action, and support resolution.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" to="/report">
                  Analyze Waste
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button size="lg" variant="secondary" to="/how-it-works">
                  See How It Works
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                {flow.map(({ label, icon: Icon }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="glass flex items-center gap-2 rounded-2xl px-4 py-3"
                  >
                    <Icon className="h-4 w-4 text-emerald" />
                    <span className="text-xs font-bold uppercase tracking-wider text-forest">
                      {label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* AI PRODUCT CARD */}
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div className="rounded-3xl border border-emerald/10 bg-white p-5 shadow-2xl shadow-emerald/10 sm:p-7">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald">
                      AI Analysis
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-forest">
                      Waste Intelligence
                    </h3>
                  </div>

                  <div className="rounded-xl bg-mint p-3">
                    <ScanSearch className="h-6 w-6 text-emerald" />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-gradient-to-br from-forest to-emerald p-8 text-center">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur">
                    <Recycle className="h-14 w-14 text-white" />
                  </div>

                  <p className="mt-5 text-sm font-medium text-white/70">
                    Detected waste
                  </p>

                  <p className="mt-1 text-2xl font-bold text-white">
                    Plastic Bottle
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-mint p-4">
                    <p className="text-xs text-gray-500">Confidence</p>
                    <p className="mt-1 text-xl font-bold text-forest">94%</p>
                  </div>

                  <div className="rounded-2xl bg-mint p-4">
                    <p className="text-xs text-gray-500">Condition</p>
                    <p className="mt-1 text-xl font-bold text-forest">
                      Good
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-emerald/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">
                        Recovery Potential
                      </p>
                      <p className="mt-1 font-bold text-emerald">
                        High Recovery
                      </p>
                    </div>

                    <div className="rounded-xl bg-mint p-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald" />
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl bg-forest p-4 text-white">
                  <p className="text-xs text-white/60">
                    Recommended Action
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-bold">♻ Recycle</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="container-page py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="eyebrow">THE PROBLEM</span>

          <h2 className="mt-4 text-4xl font-extrabold text-forest sm:text-5xl">
            Waste Is Everywhere.
            <span className="block text-emerald">
              The Right Action Isn't.
            </span>
          </h2>

          <p className="mt-5 text-lg text-gray-600">
            Identifying waste is only the first step. The real challenge is
            knowing what should happen next.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            ['01', 'Detection', 'Waste is often identified without determining its best next action.'],
            ['02', 'Confusion', 'People may not know whether an item should be reused, repaired, recycled, or disposed.'],
            ['03', 'Disconnected Reports', 'Waste reports can lack location, routing, and follow-up.'],
            ['04', 'Limited Intelligence', 'Organizations need useful patterns and insights, not just individual reports.'],
          ].map(([number, title, description], index) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="text-sm font-bold text-emerald">
                {number}
              </span>

              <h3 className="mt-4 text-xl font-bold text-forest">
                {title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-mint/50 py-20 sm:py-28">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">HOW IT WORKS</span>

            <h2 className="mt-4 text-4xl font-extrabold text-forest sm:text-5xl">
              From Waste Image
              <span className="text-emerald"> to Real-World Action.</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-5">
            {flow.map(({ label, icon: Icon }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-3xl border border-white bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint">
                  <Icon className="h-6 w-6 text-emerald" />
                </div>

                <p className="mt-5 text-xs font-bold tracking-widest text-emerald">
                  0{index + 1}
                </p>

                <h3 className="mt-2 font-bold text-forest">
                  {label}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DECISION ENGINE */}
      <section className="container-page py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="eyebrow">SMART DECISION ENGINE</span>

            <h2 className="mt-4 text-4xl font-extrabold text-forest sm:text-5xl">
              Detection Is
              <span className="text-emerald"> Only the Beginning.</span>
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              EcoWorth AI goes beyond identifying waste. It evaluates the
              item's condition and recovery potential, then recommends the
              most practical next action.
            </p>

            <div className="mt-8 space-y-4">
              {[
                'Understand what the waste is',
                'Evaluate its recovery potential',
                'Recommend the right action',
                'Route reports when intervention is needed',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-forest p-6 text-white shadow-2xl sm:p-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-green-300">
                  AI DECISION
                </p>
                <h3 className="mt-2 text-2xl font-bold">
                  Old Wooden Chair
                </h3>
              </div>

              <Wrench className="h-8 w-8 text-green-300" />
            </div>

            <div className="mt-8 space-y-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-white/50">Material</p>
                <p className="mt-1 font-semibold">Wood</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-white/50">Condition</p>
                <p className="mt-1 font-semibold">
                  Damaged but Recoverable
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-white/50">Recovery Potential</p>
                <p className="mt-1 font-semibold text-green-300">
                  High
                </p>
              </div>

              <div className="rounded-2xl bg-emerald p-4">
                <p className="text-xs text-white/70">
                  Recommended Action
                </p>
                <p className="mt-1 text-lg font-bold">
                  Repair / Reuse
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* EXAMPLES */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="container-page">
          <div className="text-center">
            <span className="eyebrow">REAL-WORLD EXAMPLES</span>

            <h2 className="mt-4 text-4xl font-extrabold text-forest sm:text-5xl">
              Every Waste Item Has a
              <span className="text-emerald"> Next Step.</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {wasteExamples.map(
              ({ title, condition, recovery, action, icon: Icon }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint">
                    <Icon className="h-6 w-6 text-emerald" />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-forest">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm text-gray-500">
                    {condition}
                  </p>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-400">
                      Recovery Potential
                    </p>
                    <p className="mt-1 font-semibold text-emerald">
                      {recovery}
                    </p>
                  </div>

                  <div className="mt-4 rounded-xl bg-mint p-3">
                    <p className="text-xs text-gray-500">
                      Recommended Action
                    </p>
                    <p className="mt-1 text-sm font-bold text-forest">
                      {action}
                    </p>
                  </div>
                </motion.div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container-page py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">THE PLATFORM</span>

          <h2 className="mt-4 text-4xl font-extrabold text-forest sm:text-5xl">
            One Platform.
            <span className="text-emerald"> Complete Intelligence.</span>
          </h2>

          <p className="mt-5 text-lg text-gray-600">
            From the first photo to the final resolution, EcoWorth AI
            connects the complete waste intelligence workflow.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="group rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald/20 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-6 w-6 text-emerald" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-forest">
                {title}
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* IMPACT */}
      <section className="bg-forest py-20 text-white sm:py-28">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>
              <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-green-300">
                WASTE INTELLIGENCE
              </span>

              <h2 className="mt-5 text-4xl font-extrabold sm:text-5xl">
                Turn Waste Data Into
                <span className="block text-green-300">
                  Better Decisions.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
                EcoWorth AI can help organizations understand what kinds of
                waste are appearing, where intervention is needed, and where
                recovery opportunities exist.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Waste Categories',
                'Recovery Opportunities',
                'Collection Needs',
                'Waste Hotspots',
                'Recurring Patterns',
                'Resolution Progress',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-300" />
                  <p className="mt-3 font-semibold">{item}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-mint/60 py-20 sm:py-28">
        <div className="container-page text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="eyebrow">READY TO EXPLORE?</span>

            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold text-forest sm:text-6xl">
              Ready to See What Your
              <span className="text-emerald"> Waste Is Worth?</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
              Upload a waste image and let EcoWorth AI determine the next
              best action.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" to="/report">
                Analyze Waste
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button size="lg" variant="secondary" to="/admin">
                Explore Platform
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  )
}