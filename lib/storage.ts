const HISTORY_KEY = 'gym_assist_history'

export interface Exercise {
  name: string
  muscleGroup: string
  sets: number
  reps: string
  rest: string
  description: string
  tips: string[]
}

export interface WorkoutInput {
  type: 'push' | 'pull' | 'legs'
  level: 'beginner' | 'intermediate' | 'pro'
  exerciseCount: number
  equipment: string[]
  intensity: 'low' | 'medium' | 'high'
}

export interface WorkoutPlan {
  id: string
  date: string
  input: WorkoutInput
  exercises: Exercise[]
  coachNotes: string
}

export function saveWorkout(plan: WorkoutPlan): void {
  const history = getHistory()
  history.unshift(plan)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)))
}

export function getHistory(): WorkoutPlan[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(HISTORY_KEY)
  return stored ? JSON.parse(stored) : []
}
