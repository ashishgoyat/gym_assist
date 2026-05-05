import { NextRequest } from 'next/server'
import { WorkoutInput } from '@/lib/storage'

const MUSCLE_GROUPS = {
  push: 'chest, front/side deltoids, and triceps',
  pull: 'lats, rhomboids, traps, biceps, and rear deltoids',
  legs: 'quadriceps, hamstrings, glutes, and calves',
}

const INTENSITY_PARAMS = {
  low: '3 sets, 12-15 reps, 45-60s rest — recovery/light session',
  medium: '3-4 sets, 8-12 reps, 60-90s rest — standard hypertrophy',
  high: '4-5 sets, 5-8 reps, 90-120s rest — strength/high effort',
}

const LEVEL_NOTES = {
  beginner: 'Use simple compound movements, prioritize form cues, avoid advanced techniques',
  intermediate: 'Mix compound and isolation movements, moderate complexity',
  pro: 'Include advanced techniques (drop sets, supersets, tempo work) as appropriate',
}

export async function POST(request: NextRequest) {
  const input: WorkoutInput = await request.json()

  const prompt = `Generate a ${input.type} day workout plan.

Details:
- Level: ${input.level} — ${LEVEL_NOTES[input.level]}
- Target muscles: ${MUSCLE_GROUPS[input.type]}
- Equipment available: ${input.equipment.join(', ')}
- Number of exercises: ${input.exerciseCount}
- Intensity: ${input.intensity} — ${INTENSITY_PARAMS[input.intensity]}

Return ONLY a valid JSON object with this exact structure:
{
  "exercises": [
    {
      "name": "Exercise Name",
      "muscleGroup": "Primary muscle",
      "sets": 3,
      "reps": "8-12",
      "rest": "60 seconds",
      "description": "How to perform the exercise in 1-2 clear sentences",
      "tips": ["Form cue or tip", "Another helpful tip"]
    }
  ],
  "coachNotes": "1-2 sentences of overall advice for this session"
}

Provide exactly ${input.exerciseCount} exercises. Only include exercises performable with the available equipment.`

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    return Response.json({ error: 'Failed to generate workout' }, { status: 500 })
  }

  const data = await response.json()
  const content = JSON.parse(data.choices[0].message.content)

  return Response.json(content)
}
