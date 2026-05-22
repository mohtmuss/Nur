import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Chat from "./pages/Chat"
import Home from "./pages/Home"
import Qibla from "./pages/Qibla"
import Duas from "./pages/Duas"
import { Menu } from "lucide-react"

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex-1 flex flex-col lg:ml-20 min-w-0">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border lg:hidden">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
            <span className="font-amiri text-primary font-bold">Nūr AI</span>
          </div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/duas" element={<Duas />} />
            <Route path="/qibla" element={<Qibla />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}