import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props { eyebrow?: string; title: string; description?: string; actions?: ReactNode }

export default function PageHeader({ eyebrow, title, description, actions }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        {eyebrow && <span className="eyebrow mb-3">{eyebrow}</span>}
        <h1 className="text-3xl font-bold text-forest sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-gray-600">{description}</p>}
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </motion.div>
  )
}
