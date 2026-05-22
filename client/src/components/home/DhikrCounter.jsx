import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

const DHIKR_LIST = [
  { arabic: 'سُبْحَانَ اللَّهِ', transliteration: 'Subhanallah', translation: 'Glory be to Allah', target: 33 },
  { arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah', translation: 'All praise is for Allah', target: 33 },
  { arabic: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar', translation: 'Allah is the Greatest', target: 33 },
  { arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', transliteration: 'La ilaha illallah', translation: 'There is no god but Allah', target: 100 },
  { arabic: 'أَسْتَغْفِرُ اللَّهَ', transliteration: 'Astaghfirullah', translation: 'I seek forgiveness from Allah', target: 100 },
]

export default function DhikrCounter() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [count, setCount] = useState(0)
  const active = DHIKR_LIST[activeIndex]
  const progress = Math.min((count / active.target) * 100, 100)
  const completed = count >= active.target

  const tap = () => setCount((c) => c + 1)
  const reset = () => setCount(0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6 h-full flex flex-col"
    >
      <h2 className="text-sm font-semibold text-foreground mb-4">Dhikr Counter</h2>

      {/* Dhikr selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {DHIKR_LIST.map((d, i) => (
          <button
            key={i}
            onClick={() => { setActiveIndex(i); setCount(0) }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeIndex === i
                ? 'bg-primary/15 text-primary border border-primary/20'
                : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            {d.transliteration}
          </button>
        ))}
      </div>

      {/* Arabic text */}
      <div className="text-center mb-6">
        <p className="font-amiri text-3xl text-primary leading-loose mb-1">{active.arabic}</p>
        <p className="text-xs text-muted-foreground">{active.translation}</p>
      </div>

      {/* Progress ring */}
      <div className="flex flex-col items-center gap-4 flex-1 justify-center">
        <div className="relative">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke="hsl(var(--primary))" strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-foreground">{count}</span>
            <span className="text-xs text-muted-foreground">/ {active.target}</span>
          </div>
        </div>

        {/* Tap button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={tap}
          className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all ${
            completed
              ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
              : 'bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20'
          }`}
        >
          {completed ? '✓ Completed!' : 'Tap to Count'}
        </motion.button>

        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>
    </motion.div>
  )
}