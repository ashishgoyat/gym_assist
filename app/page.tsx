'use client'

import { useRouter } from 'next/navigation'

const WORKOUT_TYPES = [
  {
    type: 'push',
    label: 'PUSH',
    description: 'Chest · Shoulders · Triceps',
  },
  {
    type: 'pull',
    label: 'PULL',
    description: 'Back · Biceps · Rear Delts',
  },
  {
    type: 'legs',
    label: 'LEGS',
    description: 'Quads · Hamstrings · Glutes · Calves',
  },
] as const

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      {/* Header */}
      <header className="anim-fade-in w-full max-w-2xl px-8 py-7 flex justify-center">
        <span
          className="text-xl tracking-[0.5em] text-white/80"
          style={{ fontFamily: 'var(--font-bebas)' }}
        >
          GYMASSIST
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-20 w-full max-w-2xl">
        <div className="w-full">

          {/* Display heading */}
          <div
            className="anim-fade-up mb-3 text-center"
            style={{ animationDelay: '80ms' }}
          >
            <h1
              className="text-[clamp(68px,13vw,112px)] leading-[0.9] text-white"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              TODAY&apos;S<br />SESSION.
            </h1>
          </div>

          {/* Subtitle */}
          <div
            className="anim-fade-up text-center mb-10"
            style={{ animationDelay: '160ms' }}
          >
            <p className="text-[10px] text-[#494949] uppercase tracking-[0.4em]">
              Select your workout type
            </p>
          </div>

          {/* Gold accent line */}
          <div
            className="anim-fade-in mx-auto mb-10 h-px bg-[#FFC000]"
            style={{ animationDelay: '220ms', width: '40px' }}
          />

          {/* Workout type list */}
          <div className="flex flex-col">
            {WORKOUT_TYPES.map(({ type, label, description }, i) => (
              <button
                key={type}
                onClick={() => router.push(`/configure?type=${type}`)}
                className="anim-fade-up group relative flex items-center justify-between py-8 border-t border-[#1a1a1a] hover:border-[#FFC000]/60 transition-colors duration-300 text-left pl-5"
                style={{ animationDelay: `${300 + i * 110}ms` }}
              >
                {/* Vertical gold sweep indicator */}
                <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#FFC000] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />

                <div>
                  <div
                    className="leading-none text-white group-hover:text-[#FFC000] transition-colors duration-300"
                    style={{
                      fontFamily: 'var(--font-bebas)',
                      fontSize: 'clamp(38px, 6vw, 56px)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {label}
                  </div>
                  <div className="text-[10px] text-[#494949] group-hover:text-[#7D7D7D] mt-2 uppercase tracking-[0.25em] transition-colors duration-300">
                    {description}
                  </div>
                </div>

                <span className="text-[#2a2a2a] group-hover:text-[#FFC000] transition-colors duration-300 text-lg ml-8">
                  →
                </span>
              </button>
            ))}

            {/* Closing border */}
            <div
              className="anim-fade-in border-t border-[#1a1a1a]"
              style={{ animationDelay: '630ms' }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
