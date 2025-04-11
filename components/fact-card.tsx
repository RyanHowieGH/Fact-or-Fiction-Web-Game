"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

type FactCardProps = {
  fact: {
    text: string
    isTrue: boolean
    originalText?: string
  } | null
  result: "correct" | "incorrect" | null
}

export function FactCard({ fact, result }: FactCardProps) {
  if (!fact) return null

  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-2 border-blue-200 dark:border-blue-900">
          <CardContent className="p-6">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600 dark:text-blue-300"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {result === null
                  ? "Is this fact true or false?"
                  : result === "correct"
                    ? "You got it right!"
                    : "Not quite right!"}
              </h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">{fact.text}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
