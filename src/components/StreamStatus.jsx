import { Circle } from 'lucide-react'

const STATUS_CONFIG = {
  online: { color: 'accent-text', bg: 'accent-bg-soft-20', label: 'Online' },
  offline: { color: 'accent-red-text', bg: 'accent-red-bg-soft-20', label: 'Offline' },
  unknown: { color: 'accent2-text', bg: 'accent2-bg-soft-20', label: 'Unknown' },
  checking: { color: 'text-text-muted', bg: 'bg-text-muted/20', label: 'Checking...' },
}

export default function StreamStatus({ status = 'unknown' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.unknown

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono ${config.bg} ${config.color}`}>
      <Circle size={6} fill="currentColor" className={status === 'checking' ? 'animate-pulse' : ''} />
      {config.label}
    </span>
  )
}
