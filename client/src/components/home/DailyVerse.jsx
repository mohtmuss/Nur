import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, RefreshCw } from 'lucide-react'

const VERSES = [
  { surah: 'Al-Baqarah', ayah: 286, arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', translation: 'Allah does not burden a soul beyond that it can bear.' },
  { surah: 'Al-Imran', ayah: 139, arabic: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ', translation: 'Do not weaken and do not grieve, and you will be superior if you are true believers.' },
  { surah: 'Ash-Sharh', ayah: 6, arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'Indeed, with hardship comes ease.' },
  { surah: 'Al-Baqarah', ayah: 152, arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ', translation: 'So remember Me; I will remember you.' },
  { surah: 'Az-Zumar', ayah: 53, arabic: 'إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا', translation: 'Indeed, Allah forgives all sins.' },
  { surah: 'Al-Anfal', ayah: 46, arabic: 'وَاصْبِرُوا ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', translation: 'And be patient. Indeed, Allah is with the patient.' },
]

export default function DailyVerse() {
  const [verse, setVerse] = useState(null)

  useEffect(() => {
    const index = new Date().getDate() % VERSES.length
    setVerse(VERSES[index])
  }, [])

  const refresh = () => {
    const random = VERSES[Math.floor(Math.random() * VERSES.length)]
    setVerse(random)
  }

  if (!verse) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Daily Verse</h2>
        </div>
        <button
          onClick={refresh}
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="font-amiri text-2xl text-primary leading-loose text-right mb-4" dir="rtl">
        {verse.arabic}
      </p>

      <p className="text-sm text-foreground/80 leading-relaxed mb-3">
        "{verse.translation}"
      </p>

      <p className="text-xs text-muted-foreground">
        Surah {verse.surah} • Ayah {verse.ayah}
      </p>
    </motion.div>
  )
}