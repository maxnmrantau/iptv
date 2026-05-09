import { useEffect, useRef, useState, useCallback } from 'react'
import Hls from 'hls.js'
import { X, Maximize2, MonitorPlay, PictureInPicture2, SkipForward, VolumeX, Volume2, Activity } from 'lucide-react'

export default function VideoPlayer({ channel, onClose, onNext, hasNext }) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const hlsRef = useRef(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [showStats, setShowStats] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const cleanupHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!channel?.stream?.url) return

    const video = videoRef.current
    const url = channel.stream.url
    setError(null)
    setLoading(true)
    setStats({})

    cleanupHls()

    if (url.endsWith('.m3u8') && Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      })
      hlsRef.current = hls
      hls.loadSource(url)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false)
        video.play().catch(() => {})
      })

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setError('Stream error: ' + (data.details || 'Unknown'))
          setLoading(false)
          cleanupHls()
        }
      })

      return () => {
        cleanupHls()
      }
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url
      const onLoaded = () => {
        setLoading(false)
        video.play().catch(() => {})
      }
      video.addEventListener('loadedmetadata', onLoaded)
      return () => {
        video.src = ''
        video.removeEventListener('loadedmetadata', onLoaded)
      }
    } else {
      video.src = url
      const onCanPlay = () => {
        setLoading(false)
        video.play().catch(() => {})
      }
      const onErr = () => {
        setError('Cannot play this stream. Format may not be supported.')
        setLoading(false)
      }
      video.addEventListener('canplay', onCanPlay)
      video.addEventListener('error', onErr)
      return () => {
        video.src = ''
        video.removeEventListener('canplay', onCanPlay)
        video.removeEventListener('error', onErr)
      }
    }
  }, [channel, cleanupHls])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (!channel) return
      const video = videoRef.current
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'f':
        case 'F':
          handleFullscreen()
          break
        case 'p':
        case 'P':
          handlePiP()
          break
        case 'm':
        case 'M':
          if (video) {
            video.muted = !video.muted
            setIsMuted(video.muted)
          }
          break
        case ' ':
          e.preventDefault()
          if (video) {
            video.paused ? video.play() : video.pause()
          }
          break
        case 'n':
        case 'N':
          if (hasNext) onNext()
          break
        case 's':
        case 'S':
          setShowStats(prev => !prev)
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [channel, onClose, hasNext, onNext])

  // Stats updater
  useEffect(() => {
    if (!showStats || !hlsRef.current) return
    const id = setInterval(() => {
      const hls = hlsRef.current
      if (!hls) return
      try {
        const levels = hls.levels
        const current = hls.currentLevel >= 0 ? levels[hls.currentLevel] : null
        const bw = hls.bandwidthEstimate ? Math.round(hls.bandwidthEstimate / 1000) : null
        setStats({
          resolution: current ? `${current.width}x${current.height}` : '-',
          bitrate: bw ? `${bw} kbps` : '-',
          buffer: videoRef.current?.buffered?.length
            ? (videoRef.current.buffered.end(0) - videoRef.current.currentTime).toFixed(1) + 's'
            : '-',
          dropped: hls.stats?.videoDroppedFrames || 0,
        })
      } catch {
        setStats({})
      }
    }, 1000)
    return () => clearInterval(id)
  }, [showStats])

  const handleFullscreen = () => {
    containerRef.current?.requestFullscreen?.()
  }

  const handlePiP = async () => {
    const video = videoRef.current
    if (!video) return
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture()
    } else if (video.requestPictureInPicture) {
      await video.requestPictureInPicture()
    }
  }

  if (!channel) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-5xl bg-surface border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.07)]">
          <div className="flex items-center gap-2">
            <MonitorPlay size={16} className="accent-text" />
            <span className="font-mono text-sm text-text">{channel.name}</span>
            {channel.stream?.height && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded accent-bg-soft-10 accent-text">
                {channel.stream.height}p
              </span>
            )}
            {isMuted && (
              <span className="text-[10px] font-mono accent-red-text">[MUTED]</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowStats(prev => !prev)}
              className={`p-1.5 rounded-lg transition-colors ${showStats ? 'accent-bg-soft-20 accent-text' : 'hover:bg-surface2 text-text-muted hover:text-text'}`}
              title="Toggle stats (S)"
            >
              <Activity size={16} />
            </button>
            <button
              onClick={() => {
                const v = videoRef.current
                if (v) { v.muted = !v.muted; setIsMuted(v.muted) }
              }}
              className="p-1.5 rounded-lg hover:bg-surface2 text-text-muted hover:text-text transition-colors"
              title="Toggle mute (M)"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            {hasNext && (
              <button
                onClick={onNext}
                className="p-1.5 rounded-lg hover:bg-surface2 text-text-muted hover:text-text transition-colors"
                title="Next channel (N)"
              >
                <SkipForward size={16} />
              </button>
            )}
            <button
              onClick={handlePiP}
              className="p-1.5 rounded-lg hover:bg-surface2 text-text-muted hover:text-text transition-colors"
              title="Picture-in-Picture (P)"
            >
              <PictureInPicture2 size={16} />
            </button>
            <button
              onClick={handleFullscreen}
              className="p-1.5 rounded-lg hover:bg-surface2 text-text-muted hover:text-text transition-colors"
              title="Fullscreen (F)"
            >
              <Maximize2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted transition-colors hover-accent-red-bg-soft-20 hover-accent-red-text"
              title="Close (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Player */}
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            controls
            className="w-full h-full"
            playsInline
          />

          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 accent-border border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono text-text-muted animate-pulse">Loading stream...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <p className="text-sm font-mono accent-red-text">{error}</p>
              <p className="text-xs text-text-muted">This stream might be offline or unsupported.</p>
              {hasNext && (
                <button
                  onClick={onNext}
                  className="mt-2 flex items-center gap-2 px-4 py-2 accent-bg text-bg font-mono text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  <SkipForward size={14} />
                  Try Next Channel
                </button>
              )}
            </div>
          )}

          {/* Stats Overlay */}
          {showStats && !loading && !error && (
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm border border-[rgba(255,255,255,0.07)] rounded-lg p-3 space-y-1 text-[10px] font-mono accent-text">
              <div className="text-text-muted text-[9px] uppercase tracking-widest mb-1">Stream Stats</div>
              <div>Resolution: <span className="text-text">{stats.resolution || '-'}</span></div>
              <div>Bitrate: <span className="text-text">{stats.bitrate || '-'}</span></div>
              <div>Buffer: <span className="text-text">{stats.buffer || '-'}</span></div>
              <div>Dropped: <span className="text-text">{stats.dropped || 0}</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
