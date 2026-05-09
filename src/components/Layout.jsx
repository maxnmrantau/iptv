import { Tv } from 'lucide-react'
import Clock from './Clock'
import AccentSwitcher from './AccentSwitcher'

export default function Layout({ children, sidebar, accentTheme, accentThemes, onSelectAccent }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 border-r border-[rgba(255,255,255,0.07)] bg-surface flex flex-col">
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.07)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg accent-bg flex items-center justify-center">
              <Tv size={18} className="text-bg" />
            </div>
            <div>
              <h1 className="font-mono font-bold text-sm text-text tracking-wide">IPTV<span className="accent-text">_PLAYER</span></h1>
              <p className="text-[10px] text-text-muted font-mono">v1.0.0 — cyberpunk</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Clock />
            <AccentSwitcher
              themes={accentThemes}
              current={accentTheme}
              onSelect={onSelectAccent}
            />
          </div>
        </div>
        {sidebar}
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
