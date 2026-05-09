const STORAGE_KEY = 'iptv_accent_theme'

const THEMES = [
  {
    id: 'mint',
    label: 'Neon Mint',
    accent: '#63d2a8',
    accent2: '#f5c542',
    accentRed: '#ff6b6b',
  },
  {
    id: 'cyan',
    label: 'Aqua Cyan',
    accent: '#55d8ff',
    accent2: '#f7aef8',
    accentRed: '#ff7a8a',
  },
  {
    id: 'magenta',
    label: 'Vivid Magenta',
    accent: '#ff61d2',
    accent2: '#ffe66d',
    accentRed: '#ff4d4d',
  },
  {
    id: 'amber',
    label: 'Amber Pulse',
    accent: '#f5c542',
    accent2: '#63d2a8',
    accentRed: '#ff7d5c',
  },
]

const DEFAULT_THEME = THEMES[0]

const hexToRgba = (hex, alpha) => {
  let value = hex.replace('#', '')
  if (value.length === 3) {
    value = value.split('').map(c => c + c).join('')
  }
  const num = parseInt(value, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const setCSSVar = (name, value) => {
  try {
    document.documentElement.style.setProperty(name, value)
  } catch {
    // ignore
  }
}

export const ACCENT_THEMES = THEMES

export function applyAccentTheme(theme) {
  if (!theme) return
  setCSSVar('--accent', theme.accent)
  setCSSVar('--accent-soft-10', hexToRgba(theme.accent, 0.12))
  setCSSVar('--accent-soft-15', hexToRgba(theme.accent, 0.18))
  setCSSVar('--accent-soft-20', hexToRgba(theme.accent, 0.24))
  setCSSVar('--accent2', theme.accent2)
  setCSSVar('--accent2-soft-20', hexToRgba(theme.accent2, 0.2))
  setCSSVar('--accent-red', theme.accentRed)
  setCSSVar('--accent-red-soft-20', hexToRgba(theme.accentRed, 0.2))
}

export function getThemeById(id) {
  return THEMES.find(t => t.id === id) || DEFAULT_THEME
}

export function loadAccentTheme() {
  if (typeof window === 'undefined') return DEFAULT_THEME
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return getThemeById(stored)
    }
  } catch {
    // ignore
  }
  return DEFAULT_THEME
}

export function saveAccentTheme(id) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // ignore
  }
}
