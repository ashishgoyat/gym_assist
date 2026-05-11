'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveWorkout, WorkoutPlan } from '@/lib/storage'

function getCurrentPlan(): WorkoutPlan | null {
  if (typeof window === 'undefined') return null
  const stored = sessionStorage.getItem('current_plan')
  if (!stored) return null

  try {
    return JSON.parse(stored) as WorkoutPlan
  } catch {
    return null
  }
}

export default function PlanPage() {
  const router = useRouter()
  const [plan] = useState<WorkoutPlan | null>(() => getCurrentPlan())
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!plan) {
      router.replace('/')
    }
  }, [plan, router])

  function handleSave() {
    if (!plan || saved) return
    saveWorkout(plan)
    setSaved(true)
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <span
          className="text-xl tracking-[0.4em] text-[#494949]"
          style={{ fontFamily: 'var(--font-bebas)' }}
        >
          LOADING...
        </span>
      </div>
    )
  }

  const { input, exercises, coachNotes, date } = plan

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="anim-fade-in px-8 py-7 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.push('/')}
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
        </div>
        <button
          onClick={handleSave}
          disabled={saved}
          className={`text-[10px] uppercase tracking-[0.3em] px-5 py-2.5 border transition-all duration-200 ${
            saved
              ? 'border-[#FFC000]/30 text-[#FFC000]/50 cursor-default'
              : 'border-white/20 text-white/50 hover:border-[#FFC000]/60 hover:text-[#FFC000]'
          }`}
        >
          {saved ? '✓ SAVED' : 'SAVE'}
        </button>
      </header>

      <main className="flex-1 px-8 py-10 max-w-2xl w-full mx-auto space-y-10">

        {/* Plan header */}
        <div className="anim-fade-up" style={{ animationDelay: '60ms' }}>
          <span className="text-[#FFC000] text-[10px] uppercase tracking-[0.45em] font-medium">
            {input.type.toUpperCase()} DAY
          </span>
          <h2
            className="text-[clamp(38px,7vw,62px)] leading-[0.93] mt-2"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            {exercises.length} EXERCISES<br />
            <span className="text-[#2a2a2a]">
              {input.intensity.toUpperCase()} · {input.level.toUpperCase()}
            </span>
          </h2>
          <p className="text-[10px] text-[#2a2a2a] uppercase tracking-[0.35em] mt-3">
            {formattedDate}
          </p>
        </div>

        {/* Coach notes — gold left border accent */}
        {coachNotes && (
          <div
            className="anim-fade-up border-l-2 border-[#FFC000]/50 bg-[#0d0d0d] pl-5 pr-6 py-5"
            style={{ animationDelay: '140ms' }}
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#494949] mb-3">
              Coach Notes
            </p>
            <p className="text-sm text-[#7D7D7D] leading-relaxed">{coachNotes}</p>
          </div>
        )}

        {/* Exercise list */}
        <div className="space-y-px">
          {exercises.map((exercise, i) => (
            <div
              key={i}
              className="anim-fade-up group bg-[#0d0d0d] hover:bg-[#111] border-l border-[#FFC000]/10 hover:border-[#FFC000]/30 transition-colors duration-300 p-6 space-y-4"
              style={{ animationDelay: `${220 + i * 90}ms` }}
            >
              {/* Exercise header row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-baseline gap-4">
                  {/* Gold number with glow */}
                  <span
                    className="leading-none flex-shrink-0 tabular-nums"
                    style={{
                      fontFamily: 'var(--font-bebas)',
                      fontSize: '1.6rem',
                      color: '#FFC000',
                      textShadow: '0 0 18px rgba(255,192,0,0.45)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3
                      className="text-white leading-none"
                      style={{
                        fontFamily: 'var(--font-bebas)',
                        fontSize: 'clamp(20px, 3vw, 26px)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {exercise.name.toUpperCase()}
                    </h3>
                    <p className="text-[10px] text-[#494949] uppercase tracking-[0.2em] mt-1">
                      {exercise.muscleGroup}
                    </p>
                  </div>
                </div>

                {/* Sets / Reps badges */}
                <div className="flex gap-2 flex-shrink-0 mt-0.5">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#7D7D7D] border border-[#222] group-hover:border-[#FFC000]/20 px-3 py-1.5 transition-colors duration-300">
                    {exercise.sets} SETS
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#7D7D7D] border border-[#222] group-hover:border-[#FFC000]/20 px-3 py-1.5 transition-colors duration-300">
                    {exercise.reps} REPS
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#555] leading-relaxed">{exercise.description}</p>

              {/* Rest time */}
              <p className="text-[10px] text-[#2a2a2a] uppercase tracking-[0.3em]">
                REST — {exercise.rest}
              </p>

              {/* Tips */}
              {exercise.tips && exercise.tips.length > 0 && (
                <div className="border-t border-[#181818] pt-4 space-y-2">
                  {exercise.tips.map((tip, j) => (
                    <div key={j} className="flex gap-3 text-xs text-[#555]">
                      <span
                        className="flex-shrink-0 font-medium"
                        style={{ color: '#FFC000', textShadow: '0 0 8px rgba(255,192,0,0.3)' }}
                      >
                        →
                      </span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Ghost CTA */}
        <button
          onClick={() => router.push('/')}
          className="anim-fade-up w-full py-5 bg-transparent text-[#2a2a2a] text-xs uppercase tracking-[0.35em] border border-[#1a1a1a] hover:border-white/20 hover:text-white/50 transition-all duration-300"
          style={{ animationDelay: `${220 + exercises.length * 90 + 80}ms` }}
        >
          NEW WORKOUT
        </button>
      </main>
    </div>
  )
}
