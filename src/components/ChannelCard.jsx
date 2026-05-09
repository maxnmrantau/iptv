import { Play, Globe, Heart } from 'lucide-react'
import { useState } from 'react'

export default function ChannelCard({ channel, stream, onClick, isFav, onToggleFav, isActive = false }) {
  const quality = stream?.height ? `${stream.height}p` : null
  const [logoError, setLogoError] = useState(false)

  const showFallback = !channel.logo || logoError

  return (
    <button
      onClick={onClick}
      className={`group relative w-full bg-surface border border-[rgba(255,255,255,0.07)] rounded-xl p-4 text-left transition-all hover-accent-border-soft hover:bg-surface2 focus:outline-none focus-accent ${isActive ? 'accent-border-soft' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Logo */}
        <div className="w-12 h-12 rounded-lg bg-surface2 border border-[rgba(255,255,255,0.07)] flex items-center justify-center flex-shrink-0 overflow-hidden">
          {!showFallback ? (
            <img
              src={channel.logo}
              alt={channel.name}
              className="w-full h-full object-contain p-1"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-text-muted text-lg font-mono font-bold">
              {channel.name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text truncate transition-colors group-hover:accent-text">
            {channel.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {channel.country && (
              <span className="flex items-center gap-1 text-[11px] text-text-muted">
                <Globe size={10} />
                {channel.country}
              </span>
            )}
            {quality && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded accent-bg-soft-10 accent-text">
                {quality}
              </span>
            )}
          </div>
        </div>

        {/* Equalizer overlay */}
        {isActive && (
          <div className="absolute top-3 right-3 equalizer-bars h-4">
            <span />
            <span />
            <span />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1">
          <div
            onClick={(e) => {
              e.stopPropagation()
              onToggleFav?.(channel)
            }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
              isFav ? 'accent-red-bg-soft-20 opacity-100' : 'bg-surface2 opacity-0 group-hover:opacity-100'
            }`}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={14} className={isFav ? 'accent-red-text' : 'text-text-muted'} fill={isFav ? 'currentColor' : 'none'} />
          </div>
          <div className="w-8 h-8 rounded-lg accent-bg-soft-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={14} className="accent-text" fill="currentColor" />
          </div>
        </div>
      </div>
    </button>
  )
}
