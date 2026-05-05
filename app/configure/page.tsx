'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { WorkoutInput } from '@/lib/storage'

type Level = WorkoutInput['level']
type Equipment = WorkoutInput['equipment'][number]
type Intensity = WorkoutInput['intensity']
type WorkoutType = WorkoutInput['type']

const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: 'bodyweight', label: 'Bodyweight' },
  { value: 'dumbbells', label: 'Dumbbells' },
  { value: 'machines', label: 'Machines' },
  { value: 'barbell', label: 'Barbell / Rods' },
]

const INTENSITY_OPTIONS: { value: Intensity; label: string }[] = [
  { value: 'low', label: 'Light' },
  { value: 'medium', label: 'Moderate' },
  { value: 'high', label: 'Hard' },
]

const TYPE_LABEL: Record<WorkoutType, string> = {
  push: 'Push Day',
  pull: 'Pull Day',
  legs: 'Legs Day',
}

function ToggleButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`relative py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-200 overflow-hidden ${
        selected
          ? 'bg-white text-black'
          : 'bg-transparent text-[#7D7D7D] border border-white/15 hover:border-white/40 hover:text-white'
      }`}
    >
      {/* Gold bottom edge when selected */}
      {selected && (
        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FFC000]" />
      )}
      {children}
    </button>
  )
}

function ConfigureForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = (searchParams.get('type') as WorkoutType) || 'push'

  const [level, setLevel] = useState<Level>('intermediate')
  const [equipment, setEquipment] = useState<Equipment[]>(['dumbbells'])
  const [exerciseCount, setExerciseCount] = useState(5)
  const [intensity, setIntensity] = useState<Intensity>('medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function toggleEquipment(eq: Equipment) {
    setEquipment(prev =>
      prev.includes(eq) ? prev.filter(e => e !== eq) : [...prev, eq]
    )
  }

  async function handleGenerate() {
    if (equipment.length === 0) {
      setError('Select at least one equipment type.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const input: WorkoutInput = { type, level, exerciseCount, equipment, intensity }
      const res = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!res.ok) throw new Error('API error')

      const data = await res.json()
      const plan = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        input,
        exercises: data.exercises,
        coachNotes: data.coachNotes,
      }

      sessionStorage.setItem('current_plan', JSON.stringify(plan))
      router.push('/plan')
    } catch {
      setError('Something went wrong. Check your API key and try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="anim-fade-in px-8 py-7 flex items-center gap-5 border-b border-white/5">
        <button
          onClick={() => router.back()}
          className="text-[#494949] hover:text-white transition-colors duration-200 text-lg leading-none"
        >
          ←
        </button>
        <span
          className="text-xl tracking-[0.5em] text-white/80"
          style={{ fontFamily: 'var(--font-bebas)' }}
        >
          GYMASSIST
        </span>
      </header>

      <main className="flex-1 px-8 pt-10 pb-20 max-w-xl w-full mx-auto space-y-12">

        {/* Page title */}
        <div className="anim-fade-up" style={{ animationDelay: '60ms' }}>
          <span className="text-[#FFC000] text-[10px] uppercase tracking-[0.45em] font-medium">
            {TYPE_LABEL[type]}
          </span>
          <h2
            className="text-[clamp(46px,8vw,70px)] leading-[0.93] mt-2"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            CONFIGURE<br />YOUR WORKOUT
          </h2>
        </div>

        {/* Level */}
        <section className="anim-fade-up space-y-4" style={{ animationDelay: '160ms' }}>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#494949]">Your Level</p>
          <div className="grid grid-cols-3 gap-2">
            {(['beginner', 'intermediate', 'pro'] as Level[]).map(l => (
              <ToggleButton key={l} selected={level === l} onClick={() => setLevel(l)}>
                {l}
              </ToggleButton>
            ))}
          </div>
        </section>

        {/* Equipment */}
        <section className="anim-fade-up space-y-4" style={{ animationDelay: '240ms' }}>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#494949]">Equipment Available</p>
          <div className="grid grid-cols-2 gap-2">
            {EQUIPMENT_OPTIONS.map(({ value, label }) => (
              <ToggleButton
                key={value}
                selected={equipment.includes(value)}
                onClick={() => toggleEquipment(value)}
              >
                {label}
              </ToggleButton>
            ))}
          </div>
        </section>

        {/* Exercise Count */}
        <section className="anim-fade-up space-y-5" style={{ animationDelay: '320ms' }}>
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#494949]">
              Number of Exercises
            </p>
            <span
              className="leading-none"
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '2.8rem',
                color: '#FFC000',
                textShadow: '0 0 20px rgba(255,192,0,0.35)',
              }}
            >
              {exerciseCount}
            </span>
          </div>
          <input
            type="range"
            min={3}
            max={8}
            value={exerciseCount}
            onChange={e => setExerciseCount(Number(e.target.value))}
          />
          <div className="flex justify-between text-[10px] text-[#2a2a2a] tracking-[0.2em]">
            {[3, 4, 5, 6, 7, 8].map(n => <span key={n}>{n}</span>)}
          </div>
        </section>

        {/* Intensity */}
        <section className="anim-fade-up space-y-4" style={{ animationDelay: '400ms' }}>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#494949]">Intensity</p>
          <div className="grid grid-cols-3 gap-2">
            {INTENSITY_OPTIONS.map(({ value, label }) => (
              <ToggleButton key={value} selected={intensity === value} onClick={() => setIntensity(value)}>
                {label}
              </ToggleButton>
            ))}
          </div>
        </section>

        {error && (
          <p className="anim-fade-in text-[11px] text-red-500/80 uppercase tracking-[0.2em]">
            {error}
          </p>
        )}

        {/* Gold shimmer CTA */}
        <button
          onClick={handleGenerate}
          disabled={loading || equipment.length === 0}
          className="anim-fade-up btn-gold-shimmer w-full py-5 text-sm font-semibold uppercase tracking-[0.3em]"
          style={{ animationDelay: '480ms' }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span>GENERATING</span>
              <span className="flex items-end gap-[3px]">
                <span className="loading-bar" />
                <span className="loading-bar" />
                <span className="loading-bar" />
              </span>
            </span>
          ) : (
            'GENERATE WORKOUT →'
          )}
        </button>
      </main>
    </div>
  )
}

export default function ConfigurePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <span
            className="text-xl tracking-[0.4em] text-[#494949]"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            LOADING...
          </span>
        </div>
      }
    >
      <ConfigureForm />
    </Suspense>
  )
}
