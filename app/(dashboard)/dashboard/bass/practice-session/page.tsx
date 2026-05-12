import { PracticeSession } from '@/components/bass/PracticeSession'
import { Timer } from 'lucide-react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function PracticeSessionPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/bass"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
            <Timer className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Sesión de Práctica</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Timer con rutina de ejercicios para bajo
            </p>
          </div>
        </div>
      </div>

      <PracticeSession />
    </div>
  )
}
