const TIMEOUT = 5000

export async function checkStream(url) {
  if (!url) return 'offline'

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)

  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors',
    })
    clearTimeout(timeoutId)
    // mode: 'no-cors' returns opaque response (status 0) — treat as unknown
    if (res.type === 'opaque') return 'unknown'
    return res.ok ? 'online' : 'offline'
  } catch {
    clearTimeout(timeoutId)
    return 'unknown'
  }
}
