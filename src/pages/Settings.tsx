import { useEffect, useState } from 'react'
import {
  Bell,
  Check,
  Database,
  RotateCcw,
  Save,
  Shield,
  Trash2,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'

type SettingsData = {
  notifications: boolean
  autoRefresh: boolean
  showDemoData: boolean
  aiConfidenceThreshold: number
}

const defaultSettings: SettingsData = {
  notifications: true,
  autoRefresh: true,
  showDemoData: true,
  aiConfidenceThreshold: 70,
}

export default function Settings() {
  const [settings, setSettings] =
    useState<SettingsData>(defaultSettings)

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored =
      localStorage.getItem(
        'ecoworth-settings',
      )

    if (stored) {
      try {
        setSettings(JSON.parse(stored))
      } catch {
        setSettings(defaultSettings)
      }
    }
  }, [])

  const updateSetting = <K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K],
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }))

    setSaved(false)
  }

  const saveSettings = () => {
    localStorage.setItem(
      'ecoworth-settings',
      JSON.stringify(settings),
    )

    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  const resetSettings = () => {
    setSettings(defaultSettings)

    localStorage.setItem(
      'ecoworth-settings',
      JSON.stringify(defaultSettings),
    )

    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  const clearDemoData = () => {
    const confirmed = window.confirm(
      'Clear the current EcoWorth AI report and demo team data?',
    )

    if (!confirmed) return

    localStorage.removeItem(
      'ecoworth-report',
    )

    localStorage.removeItem(
      'ecoworth-report-id',
    )

    localStorage.removeItem(
      'ecoworth-waste-type',
    )

    localStorage.removeItem(
      'ecoworth-location',
    )

    localStorage.removeItem(
      'ecoworth-analysis',
    )

    localStorage.removeItem(
      'ecoworth-teams',
    )

    window.location.reload()
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Settings"
        description="Manage EcoWorth AI workspace preferences and prototype settings."
      />

      {/* =========================
          SETTINGS
      ========================= */}

      <div className="grid gap-6 lg:grid-cols-[1fr_0.35fr]">
        <div className="space-y-6">
          {/* Notifications */}
          <section className="card p-6">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-mint text-emerald">
                <Bell className="h-5 w-5" />
              </span>

              <div>
                <h2 className="font-bold text-forest">
                  Notifications
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Control admin notification preferences.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <ToggleRow
                title="Admin notifications"
                description="Show notifications when reports need attention."
                enabled={settings.notifications}
                onChange={(value) =>
                  updateSetting(
                    'notifications',
                    value,
                  )
                }
              />

              <ToggleRow
                title="Automatic refresh"
                description="Refresh dashboard data when the page is opened."
                enabled={settings.autoRefresh}
                onChange={(value) =>
                  updateSetting(
                    'autoRefresh',
                    value,
                  )
                }
              />
            </div>
          </section>

          {/* AI Settings */}
          <section className="card p-6">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-mint text-emerald">
                <Shield className="h-5 w-5" />
              </span>

              <div>
                <h2 className="font-bold text-forest">
                  AI Analysis
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Configure how AI confidence is displayed.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-forest">
                    Confidence Threshold
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Current threshold for AI analysis.
                  </p>
                </div>

                <span className="rounded-full bg-mint px-4 py-2 text-sm font-bold text-emerald">
                  {settings.aiConfidenceThreshold}%
                </span>
              </div>

              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={
                  settings.aiConfidenceThreshold
                }
                onChange={(event) =>
                  updateSetting(
                    'aiConfidenceThreshold',
                    Number(
                      event.target.value,
                    ),
                  )
                }
                className="mt-6 w-full accent-emerald"
              />

              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </section>

          {/* Demo */}
          <section className="card p-6">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-mint text-emerald">
                <Database className="h-5 w-5" />
              </span>

              <div>
                <h2 className="font-bold text-forest">
                  Prototype Data
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Control demonstration data used by the prototype.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <ToggleRow
                title="Show demo data"
                description="Allow demonstration data to appear in admin views."
                enabled={settings.showDemoData}
                onChange={(value) =>
                  updateSetting(
                    'showDemoData',
                    value,
                  )
                }
              />
            </div>
          </section>

          {/* Save */}
          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={resetSettings}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>

            <button
              type="button"
              onClick={saveSettings}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600">
                <Trash2 className="h-5 w-5" />
              </span>

              <div>
                <h2 className="font-bold text-red-700">
                  Demo Data
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Remove the current prototype report,
                  analysis and team data from this browser.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={clearDemoData}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Clear Demo Data
            </button>
          </section>

          {/* Info */}
          <div className="mt-6 rounded-2xl bg-forest p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald">
              EcoWorth AI
            </p>

            <h3 className="mt-2 text-lg font-bold">
              Prototype Settings
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/60">
              These settings are stored locally in your
              browser for the hackathon prototype.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================
   TOGGLE
========================= */

function ToggleRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string
  description: string
  enabled: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div>
        <p className="font-semibold text-forest">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        aria-label={title}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          enabled
            ? 'bg-emerald'
            : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            enabled
              ? 'left-6'
              : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}