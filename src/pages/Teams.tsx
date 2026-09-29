import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  MapPin,
  Plus,
  RefreshCw,
  Truck,
  Users,
  X,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'

type Team = {
  id: string
  name: string
  specialization: string
  area: string
  members: number
  active: boolean
}

const defaultTeams: Team[] = [
  {
    id: 'TEAM-001',
    name: 'Recycling Response Team',
    specialization: 'Plastic, Paper, Glass & Metal',
    area: 'Local Recycling Zone',
    members: 5,
    active: true,
  },
  {
    id: 'TEAM-002',
    name: 'E-Waste Collection Team',
    specialization: 'Electronic Waste',
    area: 'City E-Waste Zone',
    members: 4,
    active: true,
  },
  {
    id: 'TEAM-003',
    name: 'Organic Waste Team',
    specialization: 'Food & Compostable Waste',
    area: 'Organic Waste Zone',
    members: 6,
    active: true,
  },
  {
    id: 'TEAM-004',
    name: 'General Waste Response',
    specialization: 'Non-Recoverable Waste',
    area: 'Municipal Collection Zone',
    members: 7,
    active: true,
  },
]

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [showForm, setShowForm] = useState(false)

  const [name, setName] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [area, setArea] = useState('')
  const [members, setMembers] = useState('')

  const loadTeams = () => {
    const saved = localStorage.getItem('ecoworth-teams')

    if (saved) {
      try {
        setTeams(JSON.parse(saved))
        return
      } catch (error) {
        console.error('Could not load teams:', error)
      }
    }

    setTeams(defaultTeams)

    localStorage.setItem(
      'ecoworth-teams',
      JSON.stringify(defaultTeams),
    )
  }

  useEffect(() => {
    loadTeams()
  }, [])

  const saveTeams = (updatedTeams: Team[]) => {
    setTeams(updatedTeams)

    localStorage.setItem(
      'ecoworth-teams',
      JSON.stringify(updatedTeams),
    )
  }

  const addTeam = () => {
    if (
      !name.trim() ||
      !specialization.trim() ||
      !area.trim() ||
      !members.trim()
    ) {
      return
    }

    const newTeam: Team = {
      id: `TEAM-${String(teams.length + 1).padStart(3, '0')}`,
      name: name.trim(),
      specialization: specialization.trim(),
      area: area.trim(),
      members: Number(members) || 1,
      active: true,
    }

    saveTeams([...teams, newTeam])

    setName('')
    setSpecialization('')
    setArea('')
    setMembers('')
    setShowForm(false)
  }

  const toggleTeam = (id: string) => {
    const updatedTeams = teams.map((team) =>
      team.id === id
        ? {
            ...team,
            active: !team.active,
          }
        : team,
    )

    saveTeams(updatedTeams)
  }

  const activeTeams = teams.filter(
    (team) => team.active,
  ).length

  const totalMembers = teams.reduce(
    (total, team) => total + team.members,
    0,
  )

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Teams"
        description="Manage responsible waste-management teams and their assigned areas."
      />

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Users}
          label="Total Teams"
          value={teams.length}
        />

        <StatCard
          icon={CheckCircle2}
          label="Active Teams"
          value={activeTeams}
        />

        <StatCard
          icon={Truck}
          label="Team Members"
          value={totalMembers}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={loadTeams}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-forest transition hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          Add Team
        </button>
      </div>

      {/* Add Team Form */}
      {showForm && (
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-forest">
                Add New Team
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Create a responsible response team.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl p-2 text-gray-400 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Input
              label="Team Name"
              placeholder="Example: Plastic Response Team"
              value={name}
              onChange={setName}
            />

            <Input
              label="Specialization"
              placeholder="Example: Plastic Recycling"
              value={specialization}
              onChange={setSpecialization}
            />

            <Input
              label="Assigned Area"
              placeholder="Example: Kakinada Zone"
              value={area}
              onChange={setArea}
            />

            <Input
              label="Number of Members"
              placeholder="Example: 5"
              type="number"
              value={members}
              onChange={setMembers}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={addTeam}
              className="rounded-xl bg-emerald px-5 py-3 text-sm font-semibold text-white"
            >
              Create Team
            </button>
          </div>
        </div>
      )}

      {/* Teams List */}
      <div className="grid gap-5 md:grid-cols-2">
        {teams.map((team) => (
          <div
            key={team.id}
            className="card p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-emerald">
                  <Users className="h-6 w-6" />
                </span>

                <div>
                  <h2 className="font-bold text-forest">
                    {team.name}
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    {team.id}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  team.active
                    ? 'bg-emerald-50 text-emerald'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {team.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <InfoRow
                icon={Truck}
                label="Specialization"
                value={team.specialization}
              />

              <InfoRow
                icon={MapPin}
                label="Assigned Area"
                value={team.area}
              />

              <InfoRow
                icon={Users}
                label="Members"
                value={`${team.members} members`}
              />
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={() => toggleTeam(team.id)}
                className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  team.active
                    ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    : 'border-emerald bg-mint text-emerald'
                }`}
              >
                {team.active
                  ? 'Deactivate Team'
                  : 'Activate Team'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Smart Assignment */}
      <div className="card bg-forest p-6 text-white sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald">
              Smart Assignment
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Route reports to the right team
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              EcoWorth AI can use the AI recommendation
              and waste category to determine which
              response team should handle a report.
            </p>
          </div>

          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/10">
            <Truck className="h-8 w-8 text-emerald" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* Statistics Card */
function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users
  label: string
  value: number
}) {
  return (
    <div className="card p-5">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-mint text-emerald">
        <Icon className="h-5 w-5" />
      </span>

      <p className="mt-5 text-3xl font-extrabold text-forest">
        {value}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        {label}
      </p>
    </div>
  )
}

/* Information Row */
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gray-50 text-emerald">
        <Icon className="h-4 w-4" />
      </span>

      <div>
        <p className="text-xs uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="text-sm font-semibold text-forest">
          {value}
        </p>
      </div>
    </div>
  )
}

/* Input */
function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-forest">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald"
      />
    </label>
  )
}