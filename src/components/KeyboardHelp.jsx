import { X, Keyboard } from 'lucide-react'

const SHORTCUTS = [
  { key: '↑ / ↓', desc: 'Navigate channels' },
  { key: 'Enter', desc: 'Play selected channel' },
  { key: 'Esc', desc: 'Close player / close overlays' },
  { key: 'Ctrl/Cmd + K', desc: 'Open command palette' },
  { key: 'F', desc: 'Toggle fullscreen' },
  { key: 'P', desc: 'Toggle Picture-in-Picture' },
  { key: 'M', desc: 'Toggle mute' },
  { key: 'Space', desc: 'Play / Pause' },
  { key: 'N', desc: 'Skip to next channel' },
  { key: 'S', desc: 'Toggle stream stats overlay' },
  { key: '?', desc: 'Show / hide this help' },
]

export default function KeyboardHelp({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-sm bg-surface border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.07)]">
          <div className="flex items-center gap-2">
            <Keyboard size={16} className="accent-text" />
            <span className="font-mono text-sm text-text font-bold">Keyboard Shortcuts</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface2 text-text-muted hover:text-text transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-4 space-y-2">
          {SHORTCUTS.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-xs text-text-muted font-sans">{s.desc}</span>
              <kbd className="px-2 py-0.5 bg-surface2 border border-[rgba(255,255,255,0.07)] rounded text-[10px] font-mono accent-text">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
