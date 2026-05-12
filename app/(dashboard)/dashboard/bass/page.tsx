import Link from 'next/link'
import { Target, Timer, Music2, ChevronRight } from 'lucide-react'

export default function BassPage() {
  const sections = [
    {
      href: '/dashboard/bass/goals',
      title: 'Metas de Práctica',
      description: 'Define y rastrea tus objetivos de bajo eléctrico',
      icon: Target,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      href: '/dashboard/bass/practice-session',
      title: 'Sesión de Práctica',
      description: 'Timer con rutina de ejercicios y metrónomo',
      icon: Timer,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 p-2 rounded-lg">
            <Music2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">Bass Practice</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Tu espacio dedicado para mejorar como bajista
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`${section.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${section.color}`} />
              </div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">
                {section.title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                {section.description}
              </p>
              <span className="flex items-center gap-1 text-sm text-primary-600 font-medium">
                Ir a sección
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
