import GreetingHeader from '../components/home/GreetingHeader'
import QuickActions from '../components/home/QuickActions'
import PrayerTimesCard from '../components/home/PrayerTimesCard'
import DailyVerse from '../components/home/DailyVerse'
import DhikrCounter from '../components/home/DhikrCounter'

export default function Home() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <GreetingHeader />
        <QuickActions />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="space-y-6">
            <PrayerTimesCard />
            <DailyVerse />
          </div>
          <div>
            <DhikrCounter />
          </div>
        </div>
      </div>
    </div>
  )
}