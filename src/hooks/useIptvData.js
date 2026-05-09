import { useState, useEffect, useMemo } from 'react'
import { fetchChannels, fetchCategories, fetchStreams } from '../utils/api'
import { getRecent, getFavorites } from '../utils/storage'

export function useIptvData() {
  const [channels, setChannels] = useState([])
  const [categories, setCategories] = useState([])
  const [streams, setStreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'recent' | 'favorites'
  const [recentList, setRecentList] = useState(() => getRecent())
  const [favoritesList, setFavoritesList] = useState(() => getFavorites())

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [channelsData, categoriesData, streamsData] = await Promise.all([
          fetchChannels(),
          fetchCategories(),
          fetchStreams(),
        ])

        const safeChannels = channelsData.filter(ch => !ch.is_nsfw)
        const safeCategories = categoriesData.filter(cat => cat.id !== 'xxx')

        setChannels(safeChannels)
        setCategories(safeCategories)
        setStreams(streamsData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Build a map: channel_id -> stream info
  const streamMap = useMemo(() => {
    const map = {}
    streams.forEach(s => {
      // Keep first (or best quality) stream per channel
      if (!map[s.channel] || (s.height && (!map[s.channel].height || s.height > map[s.channel].height))) {
        map[s.channel] = s
      }
    })
    return map
  }, [streams])

  const playableChannels = useMemo(() =>
    channels.filter(ch => streamMap[ch.id])
  , [channels, streamMap])

  // Filtered channels based on tab, category, and search
  const filteredChannels = useMemo(() => {
    let result = channels

    if (activeTab === 'recent') {
      const recentIds = new Set(recentList.map(c => c.id))
      result = result.filter(ch => recentIds.has(ch.id))
      // Sort by recent order
      const order = Object.fromEntries(recentList.map((c, i) => [c.id, i]))
      result = [...result].sort((a, b) => (order[a.id] ?? 999) - (order[b.id] ?? 999))
    } else if (activeTab === 'favorites') {
      const favIds = new Set(favoritesList.map(c => c.id))
      result = result.filter(ch => favIds.has(ch.id))
    } else {
      // all tab
      if (selectedCategory) {
        result = result.filter(ch =>
          ch.categories && ch.categories.includes(selectedCategory)
        )
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(ch =>
        ch.name && ch.name.toLowerCase().includes(q)
      )
    }

    // Only show channels that have a stream
    result = result.filter(ch => streamMap[ch.id])

    return result
  }, [channels, selectedCategory, searchQuery, streamMap, activeTab, recentList, favoritesList])

  // Count channels per category
  const categoryCounts = useMemo(() => {
    const counts = {}
    channels.forEach(ch => {
      if (ch.categories && streamMap[ch.id]) {
        ch.categories.forEach(catId => {
          counts[catId] = (counts[catId] || 0) + 1
        })
      }
    })
    return counts
  }, [channels, streamMap])

  return {
    channels: filteredChannels,
    allChannelsCount: playableChannels.length,
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
  }
}
