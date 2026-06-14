'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function HeroCommandBar() {
  const [typedText, setTypedText] = useState('')
  const fullText = "Reply to all client emails and reschedule tomorrow's meetings."

  useEffect(() => {
    let index = 0
    let isDeleting = false
    let timer: NodeJS.Timeout

    const tick = () => {
      const current = fullText.slice(0, index)
      setTypedText(current)

      if (!isDeleting) {
        index++
        if (index > fullText.length) {
          isDeleting = true
          timer = setTimeout(tick, 1000) // Pause at the end
        } else {
          timer = setTimeout(tick, 50) // Typing speed
        }
      } else {
        index--
        if (index < 0) {
          isDeleting = false
          timer = setTimeout(tick, 500) // Pause before restarting
        } else {
          timer = setTimeout(tick, 30) // Deleting speed
        }
      }
    }

    tick()
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      className="w-full glass-panel gold-glow rounded-xl p-4 flex items-center gap-3 max-w-xl relative group transition-all duration-300 border border-white/10 bg-[#192029]/60 backdrop-blur-xl mb-8"
    >
      <span className="material-symbols-outlined text-primary text-[20px]">comment</span>
      <div className="flex-1 text-xs md:text-sm text-on-surface/90 font-medium font-mono min-w-0 truncate">
        <span>{typedText}</span><span className="command-cursor"></span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span className="bg-surface-card px-1.5 py-0.5 rounded border border-white/10 text-[9px] font-mono font-bold">⌘</span>
        <span className="bg-surface-card px-1.5 py-0.5 rounded border border-white/10 text-[9px] font-mono font-bold">K</span>
      </div>
    </motion.div>
  )
}
