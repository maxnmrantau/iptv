import { useState, useEffect } from 'react'

export default function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const fmt = (n) => String(n).padStart(2, '0')

  return (
    <div className="text-[10px] font-mono text-text-muted leading-tight text-right">
      <div className="accent-text font-bold">{fmt(time.getHours())}:{fmt(time.getMinutes())}:{fmt(time.getSeconds())}</div>
      <div className="text-[9px]">{time.toLocaleDateString()}</div>
    </div>
  )
}
