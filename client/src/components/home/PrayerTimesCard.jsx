import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

const PRAYER_NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

export default function PrayerTimesCard() {
  const [times, setTimes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setLocation({ latitude, longitude })
        fetchPrayerTimes(latitude, longitude)
      },
      () => {
        // Default to Mecca if no location
        fetchPrayerTimes(21.3891, 39.8579)
      }
    )
  }, [])

  const fetchPrayerTimes = async (lat, lng) => {
    try {
      const today = new Date()
      const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lng}&method=2`
      )
      const data = await res.json()
      setTimes(data.data.timings)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const getNextPrayer = () => {
    if (!times) return null
    const now = new Date()
    const current = now.getHours() * 60 + now.getMinutes()
    for (const name of PRAYER_NAMES) {
      const [h, m] = times[name.toUpperCase()] ? times[name.toUpperCase()].split(':').map(Number) : times[name]?.split(':').map(Number) || [0, 0]
      if (h * 60 + m > current) return name
    }
    return 'Fajr'
  }

  const nextPrayer = getNextPrayer()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Prayer Times</h2>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading prayer times...</p>
      ) : times ? (
        <div className="space-y-2">
          {PRAYER_NAMES.map((name) => {
            const key = name.toUpperCase()
            const time = times[key] || times[name]
            const isNext = name === nextPrayer
            return (
              <div
                key={name}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  isNext ? 'bg-primary/10 border border-primary/20' : ''
                }`}
              >
                <span className={`text-sm ${isNext ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {name}
                </span>
                <span className={`text-sm font-mono ${isNext ? 'text-primary font-semibold' : 'text-foreground'}`}>
                  {time}
                </span>
                {isNext && (
                  <span className="text-xs text-primary/60 ml-2">Next</span>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">Could not load prayer times</p>
      )}
    </motion.div>
  )
}