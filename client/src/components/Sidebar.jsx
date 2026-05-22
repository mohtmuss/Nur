import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, MessageCircle, BookOpen, Compass, Moon, Star, X } from 'lucide-react'
import { cn } from '../lib/utils'

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: MessageCircle, label: 'AI Scholar', path: '/chat' },
  { icon: BookOpen, label: 'Duas', path: '/duas' },
  { icon: Compass, label: 'Qibla', path: '/qibla' },
]

export default function Sidebar({ isOpen, onToggle }) {
  const location = useLocation()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside className={cn(
        "fixed top-0 left-0 h-full z-50 flex flex-col",
        "bg-sidebar border-r border-sidebar-border",
        "transition-all duration-300 ease-in-out",
        "lg:translate-x-0",
        isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"
      )}>

        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center gold-glow-sm flex-shrink-0">
            <Star className="w-5 h-5 text-primary" />
          </div>
          <span className={cn(
            "font-amiri text-xl text-primary font-bold transition-opacity duration-200",
            isOpen ? "opacity-100" : "opacity-0 lg:hidden"
          )}>
            Nūr AI
          </span>
          <button
            onClick={onToggle}
            className="ml-auto lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isOpen && onToggle()}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                  />
                )}
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
                <span className={cn(
                  "text-sm font-medium transition-opacity duration-200",
                  isOpen ? "opacity-100" : "opacity-0 lg:hidden"
                )}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-sidebar-border">
          <div className={cn("flex items-center gap-3 px-3 py-2", !isOpen && "justify-center")}>
            <Moon className="w-4 h-4 text-primary/60 flex-shrink-0" />
            <span className={cn(
              "text-xs text-muted-foreground transition-opacity duration-200",
              isOpen ? "opacity-100" : "opacity-0 lg:hidden"
            )}>
              بِسْمِ ٱللَّهِ
            </span>
          </div>
        </div>
      </aside>
    </>
  )
}