import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X, Tv, Flag } from 'lucide-react'

export default function CommandPalette({ open, onClose, channels, onSelect }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const results = useMemo(() => {
    const source = channels || []
    if (!query.trim()) return source.slice(0, 30)
    const q = query.toLowerCase()
    return source
      .filter(ch => {
        const haystack = [ch.name, ch.country, ...(ch.categories || [])].filter(Boolean).join(' ').toLowerCase()
        return haystack.includes(q)
      })
      .slice(0, 50)
  }, [channels, query])

  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (!open) return
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(prev => Math.min(prev + 1, results.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(prev => Math.max(prev - 1, 0))
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        const item = results[activeIndex]
        if (item) {
          onSelect(item)
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, activeIndex, onClose, onSelect, results])

  useEffect(() => {
    if (!open) return
    setActiveIndex(prev => Math.min(prev, Math.max(results.length - 1, 0)))
  }, [results, open])

  useEffect(() => {
    const activeItem = listRef.current?.querySelector('[data-active="true"]')
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex, results])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/80 backdrop-blur-sm px-4 pt-20 pb-10"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-2xl bg-surface border border-[rgba(255,255,255,0.12)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.07)]">
          <Search size={16} className="text-text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setActiveIndex(0)
            }}
            placeholder="Search channel by name, country, or category..."
            className="flex-1 bg-transparent text-sm text-text font-sans focus:outline-none"
          />
          <kbd className="px-2 py-0.5 bg-surface2/80 border border-[rgba(255,255,255,0.07)] rounded text-[10px] font-mono text-text-muted">
            Esc
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface2 text-text-muted hover:text-text transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-text-muted font-mono">No channels matched "{query}"</div>
          ) : (
            <ul className="divide-y divide-[rgba(255,255,255,0.04)]">
              {results.map((ch, idx) => {
                const active = idx === activeIndex
                return (
                  <li key={ch.id}>
                    <button
                      data-active={active}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => {
                        onSelect(ch)
                        onClose()
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                        active ? 'accent-bg-soft-15 accent-text border-l-2 accent-border' : 'hover:bg-surface2 text-text'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-surface2 border border-[rgba(255,255,255,0.07)] flex items-center justify-center font-mono text-xs">
                        <Tv size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${active ? 'accent-text' : 'text-text'}`}>{ch.name}</p>
                        <p className="text-[11px] text-text-muted truncate">
                          {(ch.categories || []).slice(0, 3).join(', ')}
                        </p>
                      </div>
                      {ch.country && (
                        <span className="flex items-center gap-1 text-[11px] text-text-muted font-mono">
                          <Flag size={12} />
                          {ch.country}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
