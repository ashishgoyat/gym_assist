'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getHistory, WorkoutPlan } from '@/lib/storage'

export default function HistoryPage() {
  const router = useRouter()
  const [history] = useState<WorkoutPlan[]>(() => getHistory())

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="anim-fade-in px-8 py-7 flex items-center gap-5 border-b border-white/5">
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
      </header>

      <main className="flex-1 px-8 pt-10 pb-20 max-w-2xl w-full mx-auto">
        <div className="anim-fade-up" style={{ animationDelay: '60ms' }}>
          <span className="text-[#FFC000] text-[10px] uppercase tracking-[0.45em] font-medium">
            Local History
          </span>
          <h1
            className="text-[clamp(44px,8vw,68px)] leading-[0.93] mt-2"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            SAVED WORKOUTS
          </h1>
        </div>

        {history.length === 0 ? (
          <div
            className="anim-fade-up mt-10 border border-[#1a1a1a] bg-[#0d0d0d] p-7"
            style={{ animationDelay: '150ms' }}
          >
            <p className="text-sm text-[#7D7D7D] leading-relaxed">
              You have no saved workouts yet. Generate a workout plan and press SAVE on the plan page.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-px">
            {history.map((plan, index) => {
              const date = new Date(plan.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })

              return (
                <article
                  key={plan.id}
                  className="anim-fade-up bg-[#0d0d0d] border-l border-[#FFC000]/15 hover:border-[#FFC000]/35 transition-colors duration-300 p-6"
                  style={{ animationDelay: `${150 + index * 80}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2
                        className="text-white leading-none"
                        style={{
                          fontFamily: 'var(--font-bebas)',
                          fontSize: 'clamp(24px, 5vw, 34px)',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {plan.input.type.toUpperCase()} DAY
                      </h2>
                      <p className="mt-2 text-[10px] text-[#494949] uppercase tracking-[0.25em]">
                        {plan.input.level} · {plan.input.intensity} · {date}
                      </p>
                    </div>
                    <span
                      className="leading-none flex-shrink-0"
                      style={{
                        fontFamily: 'var(--font-bebas)',
                        fontSize: '1.75rem',
                        color: '#FFC000',
                        textShadow: '0 0 18px rgba(255,192,0,0.4)',
                      }}
                    >
                      {plan.exercises.length}
                    </span>
                  </div>

                  <p className="mt-4 text-[10px] text-[#2a2a2a] uppercase tracking-[0.25em]">
                    Exercises
                  </p>
                  <p className="mt-1 text-sm text-[#555] leading-relaxed">
                    {plan.exercises.map((exercise) => exercise.name).join(', ')}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
