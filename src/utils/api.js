const BASE_URL = 'https://iptv-org.github.io/api'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

function getCached(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key)
      return null
    }
    return data
  } catch {
    return null
  }
}

function setCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {
    // storage full — ignore
  }
}

async function fetchJSON(endpoint) {
  const cacheKey = `iptv_${endpoint}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const res = await fetch(`${BASE_URL}/${endpoint}`)
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`)
  const data = await res.json()
  setCache(cacheKey, data)
  return data
}

export async function fetchChannels() {
  return fetchJSON('channels.json')
}

export async function fetchCategories() {
  return fetchJSON('categories.json')
}

export async function fetchStreams() {
  return fetchJSON('streams.json')
}
