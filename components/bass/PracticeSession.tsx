'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Play, Pause, RotateCcw, Clock, Music2, Zap, ChevronRight, Save, History, Trash2, Timer } from 'lucide-react'

interface Exercise {
  id: string
  name: string
  durationMinutes: number
  bpm?: number
  notes: string
}

interface SessionLog {
  id: string
  date: string
  totalMinutes: number
  exercises: Exercise[]
}

const DEFAULT_EXERCISES: Exercise[] = [
  { id: '1', name: 'Calentamiento - Cromáticos', durationMinutes: 5, bpm: 80, notes: '4 trastes por cuerda' },
  { id: '2', name: 'Escalas Mayores', durationMinutes: 10, bpm: 100, notes: 'Do, Sol, Re, La, Mi' },
  { id: '3', name: 'Slap - Pulgar', durationMinutes: 10, bpm: 90, notes: 'Octavas con pulgar y pop' },
  { id: '4', name: 'Walking Bass', durationMinutes: 10, bpm: 120, notes: 'Blues en 12 compases' },
  { id: '5', name: 'Canción Actual', durationMinutes: 15, notes: 'Repertorio de la semana' },
]

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function PracticeSession() {
  const [exercises, setExercises] = useState<Exercise[]>(DEFAULT_EXERCISES)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [totalElapsed, setTotalElapsed] = useState(0)
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showAddExercise, setShowAddExercise] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDuration, setNewDuration] = useState('10')
  const [newBpm, setNewBpm] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load session history
  useEffect(() => {
    const saved = localStorage.getItem('bass-session-logs')
    if (saved) { try { setSessionLogs(JSON.parse(saved)) } catch { /* ignore */ } }
    const savedEx = localStorage.getItem('bass-exercises')
    if (savedEx) { try { setExercises(JSON.parse(savedEx)) } catch { /* ignore */ } }
  }, [])

  useEffect(() => { localStorage.setItem('bass-session-logs', JSON.stringify(sessionLogs)) }, [sessionLogs])
  useEffect(() => { localStorage.setItem('bass-exercises', JSON.stringify(exercises)) }, [exercises])

  const currentExercise = exercises[currentIndex]
  const targetSeconds = currentExercise ? currentExercise.durationMinutes * 60 : 0
  const exerciseProgress = targetSeconds > 0 ? Math.min((elapsed / targetSeconds) * 100, 100) : 0

  const stopTimer = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    setIsRunning(false)
  }, [])

  const startTimer = useCallback(() => {
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1)
      setTotalElapsed((prev) => prev + 1)
    }, 1000)
  }, [])

  const toggleTimer = () => { isRunning ? stopTimer() : startTimer() }

  const nextExercise = () => {
    stopTimer()
    setElapsed(0)
    if (currentIndex < exercises.length - 1) { setCurrentIndex((prev) => prev + 1) }
  }

  const resetSession = () => {
    stopTimer()
    setElapsed(0)
    setTotalElapsed(0)
    setCurrentIndex(0)
  }

  const saveSession = () => {
    if (totalElapsed < 60) return
    const log: SessionLog = { id: Date.now().toString(), date: new Date().toISOString(), totalMinutes: Math.round(totalElapsed / 60), exercises: exercises.slice(0, currentIndex + 1) }
    setSessionLogs((prev) => [log, ...prev].slice(0, 50))
    resetSession()
  }

  const addExercise = () => {
    if (!newName.trim()) return
    const ex: Exercise = { id: Date.now().toString(), name: newName.trim(), durationMinutes: parseInt(newDuration) || 10, bpm: newBpm ? parseInt(newBpm) : undefined, notes: newNotes.trim() }
    setExercises((prev) => [...prev, ex])
    setNewName(''); setNewDuration('10'); setNewBpm(''); setNewNotes(''); setShowAddExercise(false)
  }

  const removeExercise = (id: string) => {
    if (exercises.length <= 1) return
    setExercises((prev) => prev.filter((e) => e.id !== id))
    if (currentIndex >= exercises.length - 1) setCurrentIndex(Math.max(0, exercises.length - 2))
  }

  const deleteLog = (id: string) => { setSessionLogs((prev) => prev.filter((l) => l.id !== id)) }

  useEffect(() => { return () => { if (intervalRef.current) clearInterval(intervalRef.current) } }, [])

  // Circular progress ring
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (exerciseProgress / 100) * circumference

  return (
    <div className="space-y-6">
      {/* Timer Display */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="relative inline-flex items-center justify-center mb-6">
          <svg width="180" height="180" className="transform -rotate-90">
            <circle cx="90" cy="90" r={radius} stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200 dark:text-gray-700" />
            <circle cx="90" cy="90" r={radius} stroke="url(#gradient)" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000" />
            <defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient></defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold font-mono">{formatTime(elapsed)}</span>
            <span className="text-xs text-gray-500 mt-1">/ {formatTime(targetSeconds)}</span>
          </div>
        </div>

        {currentExercise && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-1">{currentExercise.name}</h2>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              {currentExercise.bpm && <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{currentExercise.bpm} BPM</span>}
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{currentExercise.durationMinutes} min</span>
            </div>
            {currentExercise.notes && <p className="text-sm text-gray-400 mt-2 italic">{currentExercise.notes}</p>}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="sm" onClick={resetSession}><RotateCcw className="w-5 h-5" /></Button>
          <button onClick={toggleTimer} className={cn('w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5', isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700')}>
            {isRunning ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white ml-1" />}
          </button>
          <Button variant="ghost" size="sm" onClick={nextExercise} disabled={currentIndex >= exercises.length - 1}><ChevronRight className="w-5 h-5" /></Button>
        </div>

        {/* Total time */}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Timer className="w-4 h-4" />
          <span>Tiempo total: <strong className="text-gray-700 dark:text-gray-300">{formatTime(totalElapsed)}</strong></span>
        </div>
      </div>

      {/* Exercise List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2"><Music2 className="w-4 h-4 text-primary-600" />Rutina de Ejercicios</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)}><History className="w-4 h-4" /></Button>
            <Button variant="gradient" size="sm" onClick={() => setShowAddExercise(!showAddExercise)}>
              <span className="text-lg leading-none mr-1">+</span>Agregar
            </Button>
          </div>
        </div>

        {/* Add Exercise Form */}
        {showAddExercise && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Input label="Nombre" placeholder="Ej: Arpegios" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <Input label="Duración (min)" type="number" placeholder="10" value={newDuration} onChange={(e) => setNewDuration(e.target.value)} />
              <Input label="BPM (opcional)" type="number" placeholder="120" value={newBpm} onChange={(e) => setNewBpm(e.target.value)} />
              <Input label="Notas" placeholder="Detalles..." value={newNotes} onChange={(e) => setNewNotes(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowAddExercise(false)}>Cancelar</Button>
              <Button variant="primary" size="sm" onClick={addExercise} disabled={!newName.trim()}>Agregar</Button>
            </div>
          </div>
        )}

        {/* Exercise Steps */}
        <div className="space-y-2">
          {exercises.map((ex, i) => (
            <div key={ex.id} onClick={() => { if (!isRunning) { stopTimer(); setElapsed(0); setCurrentIndex(i) } }}
              className={cn('flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all', i === currentIndex ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' : i < currentIndex ? 'bg-green-50 dark:bg-green-900/10 opacity-60' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50')}>
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0', i === currentIndex ? 'bg-primary-600 text-white' : i < currentIndex ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500')}>
                {i < currentIndex ? '✓' : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('font-medium text-sm', i === currentIndex && 'text-primary-600')}>{ex.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{ex.durationMinutes} min</span>
                  {ex.bpm && <span>• {ex.bpm} BPM</span>}
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); removeExercise(ex.id) }} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Save Session */}
        {totalElapsed >= 60 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="gradient" className="w-full" onClick={saveSession}><Save className="w-4 h-4 mr-2" />Guardar Sesión ({Math.round(totalElapsed / 60)} min)</Button>
          </div>
        )}
      </div>

      {/* History */}
      {showHistory && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 animate-fade-in">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><History className="w-4 h-4 text-primary-600" />Historial de Sesiones</h3>
          {sessionLogs.length === 0 ? (
            <p className="text-center text-gray-400 py-6">No hay sesiones registradas</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sessionLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div>
                    <p className="text-sm font-medium">{new Date(log.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                    <p className="text-xs text-gray-400">{log.exercises.length} ejercicios • {log.totalMinutes} min</p>
                  </div>
                  <button onClick={() => deleteLog(log.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
