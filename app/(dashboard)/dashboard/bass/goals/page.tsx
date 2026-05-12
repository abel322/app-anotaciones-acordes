import { GoalList } from '@/components/bass/GoalList'
import { Target } from 'lucide-react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/bass"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Metas de Práctica</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Define y rastrea tus objetivos de bajo
            </p>
          </div>
        </div>
      </div>

      <GoalList />
    </div>
  )
}
