import { motion } from 'framer-motion'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return { text: 'Good Morning', arabic: 'صَبَاحُ الْخَيْر' }
  if (hour < 17) return { text: 'Good Afternoon', arabic: 'مَسَاءُ الْخَيْر' }
  return { text: 'Good Evening', arabic: 'مَسَاءُ الْخَيْر' }
}

export default function GreetingHeader() {
  const greeting = getGreeting()
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <p className="text-muted-foreground text-sm mb-1">{date}</p>
      <h1 className="text-3xl font-bold text-foreground">{greeting.text}</h1>
      <p className="font-amiri text-2xl text-primary/80 mt-1">{greeting.arabic}</p>
    </motion.div>
  )
}