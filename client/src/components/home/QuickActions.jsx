import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, BookOpen, Compass, Heart } from 'lucide-react'

const actions = [
  { icon: MessageCircle, label: 'AI Scholar', desc: 'Ask anything', path: '/chat', color: 'text-yellow-500' },
  { icon: BookOpen, label: 'Duas', desc: 'Daily supplications', path: '/duas', color: 'text-emerald-500' },
  { icon: Compass, label: 'Qibla', desc: 'Find direction', path: '/qibla', color: 'text-blue-500' },
  { icon: Heart, label: 'Dhikr', desc: 'Remember Allah', path: '/', color: 'text-rose-500' },
]

export default function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => navigate(action.path)}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:bg-secondary transition-all text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center">
            <action.icon className={`w-5 h-5 ${action.color}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{action.label}</p>
            <p className="text-xs text-muted-foreground">{action.desc}</p>
          </div>
        </motion.button>
      ))}
    </div>
  )
}