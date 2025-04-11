"use client"

import { Badge } from "@/components/ui/badge"
import { Flame } from "lucide-react"
import { motion } from "framer-motion"

type StreakCounterProps = {
  streak: number
}

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <motion.div initial={{ scale: 1 }} animate={{ scale: streak > 0 ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.3 }}>
      <Badge variant="outline" className="px-3 py-1 text-lg bg-white dark:bg-gray-800 shadow">
        <Flame className={`h-5 w-5 mr-1 ${streak > 0 ? "text-orange-500" : "text-gray-400"}`} />
        <span className="font-bold">{streak}</span>
      </Badge>
    </motion.div>
  )
}
