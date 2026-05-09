import { useState, useCallback, useRef } from 'react'
import ChannelCard from './ChannelCard'
import StreamStatus from './StreamStatus'
import { checkStream } from '../utils/streamChecker'
import { DownloadCloud } from 'lucide-react'

export default function ChannelList({ channels, streamMap, onSelectChannel, selectedChannel, onToggleFav, favoritesList }) {
  const [statusMap, setStatusMap] = useState({})
  const [checking, setChecking] = useState({})
  const checkingRef = useRef(checking)
  checkingRef.current = checking

  const handleCheckStream = useCallback(async (channelId) => {
    if (checkingRef.current[channelId]) return
    setChecking(prev => ({ ...prev, [channelId]: true }))
    const stream = streamMap[channelId]
    if (!stream?.url) {
      setStatusMap(prev => ({ ...prev, [channelId]: 'offline' }))
      setChecking(prev => ({ ...prev, [channelId]: false }))
      return
    }
    const status = await checkStream(stream.url)
    setStatusMap(prev => ({ ...prev, [channelId]: status }))
    setChecking(prev => ({ ...prev, [channelId]: false }))
  }, [streamMap])

  const handleCardClick = useCallback((channel) => {
    const stream = streamMap[channel.id]
    if (!stream) return
    onSelectChannel({ ...channel, stream })
  }, [streamMap, onSelectChannel])

  const favIds = useRef(new Set())
  favIds.current = new Set(favoritesList.map(c => c.id))

  const handleExportM3U = useCallback(() => {
    if (!channels.length) return
    const lines = ['#EXTM3U']
    channels.forEach(channel => {
      const stream = streamMap[channel.id]
      if (!stream?.url) return
      const attrs = [
        `tvg-id="${channel.id || ''}"`,
        `tvg-name="${channel.name || ''}"`,
        `tvg-logo="${channel.logo || ''}"`,
        `group-title="${(channel.categories || []).join(';')}"`,
      ].join(' ')
      lines.push(`#EXTINF:-1 ${attrs},${channel.name}`)
      lines.push(stream.url)
    })

    if (lines.length <= 1) return

    const blob = new Blob([lines.join('\n')], { type: 'application/vnd.apple.mpegurl' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `iptv-export-${Date.now()}.m3u8`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }, [channels, streamMap])

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-mono font-bold text-text">
          Channels
          <span className="ml-2 text-sm font-mono accent-text">{channels.length}</span>
        </h2>
        <button
          onClick={handleExportM3U}
          disabled={!channels.length}
          className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-mono rounded-lg border border-[rgba(255,255,255,0.07)] bg-surface2 text-text-muted transition-all hover-accent-text disabled:opacity-40 disabled:cursor-not-allowed"
          title="Export filtered channels to M3U"
        >
          <DownloadCloud size={14} />
          Export .m3u8
        </button>
      </div>

      {channels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted">
          <p className="font-mono text-sm">No channels found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {channels.map(channel => (
            <div
              key={channel.id}
              className={`relative ${selectedChannel?.id === channel.id ? 'ring-1 rounded-xl' : ''}`}
              style={selectedChannel?.id === channel.id ? { '--tw-ring-color': 'var(--accent)' } : undefined}
            >
              <ChannelCard
                channel={channel}
                stream={streamMap[channel.id]}
                onClick={() => handleCardClick(channel)}
                isFav={favIds.current.has(channel.id)}
                onToggleFav={onToggleFav}
                isActive={selectedChannel?.id === channel.id}
              />
              <div
                className="absolute top-2 right-[5.5rem] cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCheckStream(channel.id)
                }}
                title="Check stream status"
              >
                <StreamStatus
                  status={
                    checking[channel.id]
                      ? 'checking'
                      : statusMap[channel.id] || 'unknown'
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
