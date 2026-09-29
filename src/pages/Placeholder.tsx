import type { LucideIcon } from 'lucide-react'
import { Hammer } from 'lucide-react'
import PageHeader from '../components/PageHeader'

interface Props { title: string; description: string; stage: number; icon?: LucideIcon; eyebrow?: string }

/** Stage-1 scaffold page. Replaced by the real feature in its stage. */
export default function Placeholder({ title, description, stage, icon: Icon = Hammer, eyebrow }: Props) {
  return (
    <div className="container-page py-12">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="card flex flex-col items-center px-6 py-16 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-mint text-emerald"><Icon className="h-7 w-7" /></span>
        <h2 className="mt-5 text-xl font-semibold text-forest">Coming in Stage {stage}</h2>
        <p className="mt-2 max-w-md text-sm text-gray-600">
          The page structure, routing and layout are ready. The full feature is built in Stage {stage}.
        </p>
      </div>
    </div>
  )
}
