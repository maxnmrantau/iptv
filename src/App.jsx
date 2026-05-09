import { useState, useEffect, useCallback, useMemo } from 'react'
import Layout from './components/Layout'
import Sidebar from './components/Sidebar'
import ChannelList from './components/ChannelList'
import VideoPlayer from './components/VideoPlayer'
import KeyboardHelp from './components/KeyboardHelp'
import CommandPalette from './components/CommandPalette'
import { useIptvData } from './hooks/useIptvData'
import { addRecent, toggleFavorite, clearRecent } from './utils/storage'
import { ACCENT_THEMES, applyAccentTheme, loadAccentTheme, saveAccentTheme } from './utils/theme'
import { Loader2, AlertCircle, Keyboard, Search } from 'lucide-react'

export default function App() {
  const {
    channels,
    allChannelsCount,
    categories,
    categoryCounts,
    streamMap,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    recentList,
    setRecentList,
    favoritesList,
    setFavoritesList,
    playableChannels,
  } = useIptvData()

  const [selectedChannel, setSelectedChannel] = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showPalette, setShowPalette] = useState(false)
  const [accentTheme, setAccentTheme] = useState(() => loadAccentTheme())

  const paletteChannels = useMemo(() =>
    playableChannels.map(ch => ({ ...ch, stream: streamMap[ch.id] }))
  , [playableChannels, streamMap])

  useEffect(() => {
    if (!accentTheme) return
    applyAccentTheme(accentTheme)
    saveAccentTheme(accentTheme.id)
  }, [accentTheme])

  const handleSelectChannel = useCallback((channel) => {
    const stream = channel.stream || streamMap[channel.id]
    if (!stream) return
    const enriched = { ...channel, stream }
    setSelectedChannel(enriched)
    setRecentList(addRecent(enriched))
  }, [setRecentList, streamMap])

  const handleToggleFav = useCallback((channel) => {
    setFavoritesList(toggleFavorite(channel))
  }, [setFavoritesList])

  const handleClearRecent = useCallback(() => {
    clearRecent()
    setRecentList([])
  }, [setRecentList])

  const handleNextChannel = useCallback(() => {
    if (!selectedChannel || channels.length === 0) return
    const idx = channels.findIndex(c => c.id === selectedChannel.id)
    const next = channels[idx + 1]
    if (next && streamMap[next.id]) {
      handleSelectChannel({ ...next, stream: streamMap[next.id] })
    }
  }, [selectedChannel, channels, streamMap, handleSelectChannel])

  // Keyboard shortcuts (global)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setShowHelp(prev => !prev)
      }
      if (e.key === 'Escape') {
        setShowHelp(false)
        setShowPalette(false)
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setShowPalette(true)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-bg accent-text">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin" />
          <p className="font-mono text-sm animate-pulse">Loading channels from iptv-org...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-bg accent-red-text">
        <div className="flex flex-col items-center gap-3 max-w-md text-center px-6">
          <AlertCircle size={32} />
          <p className="font-mono text-sm">Failed to load data</p>
          <p className="text-xs text-text-muted">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 accent-bg text-bg font-mono text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Layout
        sidebar={
          <Sidebar
            categories={categories}
            categoryCounts={categoryCounts}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            allChannelsCount={allChannelsCount}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            recentCount={recentList.length}
            favoritesCount={favoritesList.length}
            onClearRecent={handleClearRecent}
          />
        }
        accentTheme={accentTheme}
        accentThemes={ACCENT_THEMES}
        onSelectAccent={setAccentTheme}
      >
        <ChannelList
          channels={channels}
          streamMap={streamMap}
          onSelectChannel={handleSelectChannel}
          selectedChannel={selectedChannel}
          onToggleFav={handleToggleFav}
          favoritesList={favoritesList}
        />
      </Layout>

      {/* Floating buttons */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        <button
          onClick={() => setShowPalette(true)}
          className="w-11 h-11 rounded-full bg-surface2 border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-text-muted transition-all shadow-lg hover-accent-text"
          title="Command palette (Ctrl/Cmd + K)"
        >
          <Search size={18} />
        </button>
        <button
          onClick={() => setShowHelp(true)}
          className="w-11 h-11 rounded-full bg-surface2 border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-text-muted transition-all shadow-lg hover-accent-text"
          title="Keyboard shortcuts (?)"
        >
          <Keyboard size={18} />
        </button>
      </div>

      {selectedChannel && (
        <VideoPlayer
          channel={selectedChannel}
          onClose={() => setSelectedChannel(null)}
          onNext={handleNextChannel}
          hasNext={
            selectedChannel && channels.length > 0 &&
            channels.findIndex(c => c.id === selectedChannel.id) < channels.length - 1
          }
        />
      )}

      {showHelp && <KeyboardHelp onClose={() => setShowHelp(false)} />}
      <CommandPalette
        open={showPalette}
        onClose={() => setShowPalette(false)}
        channels={paletteChannels}
        onSelect={handleSelectChannel}
      />
    </>
  )
}
