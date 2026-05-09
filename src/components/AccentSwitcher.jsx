import { useEffect, useRef, useState } from 'react'
import { Palette } from 'lucide-react'

export default function AccentSwitcher({ themes, current, onSelect }) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (!panelRef.current) return
      if (!panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('mousedown', handleClick)
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('mousedown', handleClick)
      window.removeEventListener('keydown', handleKey)
    }
  }, [open])

  if (!current) return null

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-surface2 text-[11px] font-mono text-text-muted hover:text-text transition-colors"
        title="Switch accent theme"
      >
        <span
          className="w-3 h-3 rounded-full border border-[rgba(255,255,255,0.12)]"
          style={{ backgroundColor: current.accent }}
        />
        {current.label}
        <Palette size={14} className="opacity-70" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-surface border border-[rgba(255,255,255,0.12)] rounded-xl shadow-2xl overflow-hidden z-10">
          <div className="max-h-56 overflow-y-auto">
            {themes.map(theme => {
              const selected = theme.id === current.id
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    onSelect(theme)
                    setOpen(false)
                  }}
                  className={`w-full px-3 py-2 flex items-center gap-2 text-left text-[11px] font-mono transition-colors ${
                    selected ? 'accent-bg-soft-20 accent-text' : 'hover:bg-surface2 text-text-muted hover:text-text'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-[rgba(255,255,255,0.12)]"
                    style={{ backgroundColor: theme.accent }}
                  />
                  <span className="flex-1 truncate">{theme.label}</span>
                </button>
              )}
            )}
          </div>
        </div>
      )}
    </div>
  )
}
