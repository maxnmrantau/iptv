const STORAGE_KEYS = {
  recent: 'iptv_recent',
  favorites: 'iptv_favorites',
}

const MAX_RECENT = 20

function get(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

export function getRecent() {
  return get(STORAGE_KEYS.recent) || []
}

export function addRecent(channel) {
  const list = getRecent()
  const filtered = list.filter(c => c.id !== channel.id)
  const updated = [channel, ...filtered].slice(0, MAX_RECENT)
  set(STORAGE_KEYS.recent, updated)
  return updated
}

export function clearRecent() {
  set(STORAGE_KEYS.recent, [])
}

export function getFavorites() {
  return get(STORAGE_KEYS.favorites) || []
}

export function toggleFavorite(channel) {
  const list = getFavorites()
  const exists = list.find(c => c.id === channel.id)
  const updated = exists
    ? list.filter(c => c.id !== channel.id)
    : [...list, channel]
  set(STORAGE_KEYS.favorites, updated)
  return updated
}

export function isFavorite(channelId) {
  const list = getFavorites()
  return list.some(c => c.id === channelId)
}
