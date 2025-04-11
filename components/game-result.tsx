"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { AlertCircle, ArrowRight, CheckCircle } from "lucide-react"

type GameResultProps = {
  result: "correct" | "incorrect"
  fact: {
    text: string
    isTrue: boolean
    originalText?: string
  } | null
  onNextFact: () => void
}

export function GameResult({ result, fact, onNextFact }: GameResultProps) {
  if (!fact) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
    >
      <div className="mb-4">
        {result === "correct" ? (
          <div className="flex items-center text-green-600 dark:text-green-400 mb-2">
            <CheckCircle className="h-6 w-6 mr-2" />
            <span className="text-lg font-medium">Correct!</span>
          </div>
        ) : (
          <div className="flex items-center text-red-600 dark:text-red-400 mb-2">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span className="text-lg font-medium">Incorrect!</span>
          </div>
        )}

        {result === "incorrect" && fact.originalText && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">The actual fact is:</p>
            <p className="text-gray-800 dark:text-gray-200">{fact.originalText}</p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button onClick={onNextFact} size="lg" className="px-6">
          Next Fact
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  )
}
