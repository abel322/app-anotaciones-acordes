'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Target, Plus, Trash2, CheckCircle2, Circle, Trophy, Flame, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'

interface Goal {
  id: string
  title: string
  description: string
  category: 'technique' | 'theory' | 'repertoire' | 'ear'
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  createdAt: string
  completedAt?: string
}

const CATEGORIES = [
  { value: 'technique' as const, label: 'Técnica', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
  { value: 'theory' as const, label: 'Teoría', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800' },
  { value: 'repertoire' as const, label: 'Repertorio', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' },
  { value: 'ear' as const, label: 'Oído', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800' },
]

const PRIORITIES = [
  { value: 'low' as const, label: 'Baja', dot: 'bg-gray-400' },
  { value: 'medium' as const, label: 'Media', dot: 'bg-yellow-400' },
  { value: 'high' as const, label: 'Alta', dot: 'bg-red-500' },
]

export function GoalList() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newCategory, setNewCategory] = useState<Goal['category']>('technique')
  const [newPriority, setNewPriority] = useState<Goal['priority']>('medium')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('bass-goals')
    if (saved) { try { setGoals(JSON.parse(saved)) } catch { /* ignore */ } }
  }, [])

  useEffect(() => { localStorage.setItem('bass-goals', JSON.stringify(goals)) }, [goals])

  const addGoal = () => {
    if (!newTitle.trim()) return
    const goal: Goal = { id: Date.now().toString(), title: newTitle.trim(), description: newDescription.trim(), category: newCategory, priority: newPriority, completed: false, createdAt: new Date().toISOString() }
    setGoals((prev) => [goal, ...prev])
    setNewTitle(''); setNewDescription(''); setNewCategory('technique'); setNewPriority('medium'); setShowForm(false)
  }

  const toggleGoal = (id: string) => {
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, completed: !g.completed, completedAt: !g.completed ? new Date().toISOString() : undefined } : g))
  }

  const deleteGoal = (id: string) => { setGoals((prev) => prev.filter((g) => g.id !== id)) }

  const filteredGoals = goals.filter((g) => { if (filter === 'active') return !g.completed; if (filter === 'completed') return g.completed; return true })
  const completedCount = goals.filter((g) => g.completed).length
  const totalCount = goals.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const getCategoryInfo = (cat: Goal['category']) => CATEGORIES.find((c) => c.value === cat) || CATEGORIES[0]
  const getPriorityInfo = (pri: Goal['priority']) => PRIORITIES.find((p) => p.value === pri) || PRIORITIES[1]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
          <Target className="w-5 h-5 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{totalCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Metas Totales</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
          <Trophy className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{completedCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Completadas</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
          <Flame className="w-5 h-5 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{progress}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Progreso</p>
        </div>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary-600" />Progreso General</span>
            <span className="text-sm text-gray-500">{completedCount}/{totalCount}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary-600 to-blue-600 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Filter + Add */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 text-sm rounded-lg transition-colors', filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700')}>
              {f === 'all' ? 'Todas' : f === 'active' ? 'Activas' : 'Completadas'}
            </button>
          ))}
        </div>
        <Button variant="gradient" size="sm" onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4 mr-1" />Nueva Meta</Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-fade-in">
          <h3 className="text-lg font-semibold mb-4">Agregar Nueva Meta</h3>
          <div className="space-y-4">
            <Input label="Título" placeholder="Ej: Dominar slap a 120 BPM" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addGoal()} />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción (opcional)</label>
              <textarea className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 placeholder:text-gray-400 resize-none" rows={2} placeholder="Detalles adicionales..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button key={cat.value} onClick={() => setNewCategory(cat.value)} className={cn('px-3 py-1 text-xs rounded-full border transition-all', newCategory === cat.value ? `${cat.bg} ${cat.border} ${cat.color} font-semibold ring-2 ring-offset-1 ring-primary-500/30` : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300')}>{cat.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
                <div className="flex gap-2">
                  {PRIORITIES.map((pri) => (
                    <button key={pri.value} onClick={() => setNewPriority(pri.value)} className={cn('flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border transition-all', newPriority === pri.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-semibold' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300')}>
                      <span className={cn('w-2 h-2 rounded-full', pri.dot)} />{pri.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button variant="primary" size="sm" onClick={addGoal} disabled={!newTitle.trim()}>Guardar Meta</Button>
            </div>
          </div>
        </div>
      )}

      {/* Goal Cards */}
      <div className="space-y-3">
        {filteredGoals.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">{filter === 'completed' ? 'Aún no has completado metas' : 'No tienes metas aún'}</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">{filter === 'completed' ? '¡Sigue practicando!' : 'Agrega tu primera meta de práctica de bajo'}</p>
          </div>
        ) : filteredGoals.map((goal) => {
          const catInfo = getCategoryInfo(goal.category)
          const priInfo = getPriorityInfo(goal.priority)
          const isExpanded = expandedGoal === goal.id
          return (
            <div key={goal.id} className={cn('bg-white dark:bg-gray-800 rounded-xl border p-4 transition-all duration-300 hover:shadow-md', goal.completed ? 'border-green-200 dark:border-green-800/50 opacity-80' : 'border-gray-200 dark:border-gray-700')}>
              <div className="flex items-start gap-3">
                <button onClick={() => toggleGoal(goal.id)} className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110">
                  {goal.completed ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600 hover:text-primary-500" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={cn('font-medium', goal.completed && 'line-through text-gray-400 dark:text-gray-500')}>{goal.title}</h4>
                    <span className={cn('px-2 py-0.5 text-xs rounded-full', catInfo.bg, catInfo.color)}>{catInfo.label}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400"><span className={cn('w-1.5 h-1.5 rounded-full', priInfo.dot)} />{priInfo.label}</span>
                  </div>
                  {isExpanded && goal.description && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 animate-fade-in">{goal.description}</p>}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">{new Date(goal.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                    {goal.completedAt && <span className="text-xs text-green-500">✓ {new Date(goal.completedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {goal.description && <button onClick={() => setExpandedGoal(isExpanded ? null : goal.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors">{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>}
                  <button onClick={() => deleteGoal(goal.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
