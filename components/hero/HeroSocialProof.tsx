'use client'
import { motion } from 'framer-motion'
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar'

export function HeroSocialProof() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="flex items-center gap-3"
    >
      <AvatarGroup className="-space-x-3">
        <Avatar className="w-8 h-8 size-8 border-2 border-background overflow-hidden bg-surface-card shadow-lg">
          <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJHj5C3rmaZFTeZj9ErBV2co6jpaYhF6hoyjbOOdLRE9riMZHmDcVvVbu0A6YaWJoHIeW-Eqvw-W6YhpTWyzPJUxQxX-go_kyMzbrs8VuHkat4r-7P5Q7v4R_CuS7f4OqGFU8rT7iQM75UUGOQ4rVWqNUfj-RwNEHGMAxSnGFu9raoVRT-2XQw9C4ZxFiCAJA3hnThEuqD8avqipiVCfVr7unJFWH2WqVKkatefnQDM69RRDAHWIqt" alt="Executive" />
          <AvatarFallback>E1</AvatarFallback>
        </Avatar>
        <Avatar className="w-8 h-8 size-8 border-2 border-background overflow-hidden bg-surface-card shadow-lg">
          <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXu8xZ7P4bQ2sF2WZCDh5X2lj_rQR_cGgx-MhAGC8JEzrRMhE57rGqjtamnWtjg_2WZqKTGJ1aLpD6RBN6viplWu7Wnn__JRLyFV_u5N8yospB-zv3M6cnV3oIdaddw9IRJ0_9X7JF0lxiTCBA5DT1S89NUxYjM_wKP5oGy0bhqPW4nT2XSSeC2VxTHWIPkdPhE-mrN95YBEMm8u0INYg0xv2OHQMA80rS1N8o-AbZppWPlThSVARiE" alt="Executive" />
          <AvatarFallback>E2</AvatarFallback>
        </Avatar>
        <AvatarGroupCount className="w-8 h-8 size-8 rounded-full border-2 border-background bg-primary-container flex items-center justify-center shadow-lg text-primary font-bold text-[9px]">
          +5k
        </AvatarGroupCount>
      </AvatarGroup>
      <span className="font-mono text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">Trusted by Fortune 500 Leaders</span>
    </motion.div>
  )
}
