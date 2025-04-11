"use client"

import { useState, useEffect } from "react"
import { FactCard } from "@/components/fact-card"
import { GameControls } from "@/components/game-controls"
import { GameResult } from "@/components/game-result"
import { StreakCounter } from "@/components/streak-counter"
import { useSupabase } from "@/components/supabase-provider"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

type Fact = {
  text: string
  isTrue: boolean
  originalText?: string
}

export function GameContainer() {
  const [fact, setFact] = useState<Fact | null>(null)
  const [loading, setLoading] = useState(true)
  const [answering, setAnswering] = useState(false)
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null)
  const [streak, setStreak] = useState(0)
  const { session, supabase } = useSupabase()
  const { toast } = useToast()

  const fetchFact = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/facts/random")
      if (!response.ok) throw new Error("Failed to fetch fact")

      const data = await response.json()
      setFact(data)
    } catch (error) {
      console.error("Error fetching fact:", error)
      toast({
        title: "Error",
        description: "Failed to load a new fact. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = async (answer: boolean) => {
    if (!fact) return

    setAnswering(true)

    // Check if answer is correct
    const isCorrect = answer === fact.isTrue

    // Update result state
    setResult(isCorrect ? "correct" : "incorrect")

    // Update streak
    if (isCorrect) {
      setStreak((prev) => prev + 1)
    } else {
      setStreak(0)
    }

    // If user is logged in, update their streak in the database
    if (session?.user) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("current_streak, highest_streak")
          .eq("id", session.user.id)
          .single()

        const newStreak = isCorrect ? (profile?.current_streak || 0) + 1 : 0
        let highestStreak = profile?.highest_streak || 0

        if (newStreak > highestStreak) {
          highestStreak = newStreak
        }

        await supabase
          .from("profiles")
          .update({
            current_streak: newStreak,
            highest_streak: highestStreak,
          })
          .eq("id", session.user.id)
      } catch (error) {
        console.error("Error updating streak:", error)
      }
    }

    setAnswering(false)
  }

  const handleNextFact = () => {
    fetchFact()
  }

  useEffect(() => {
    fetchFact()

    // If user is logged in, get their current streak
    if (session?.user) {
      const getStreak = async () => {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("current_streak")
            .eq("id", session.user.id)
            .single()

          if (profile) {
            setStreak(profile.current_streak || 0)
          }
        } catch (error) {
          console.error("Error fetching streak:", error)
        }
      }

      getStreak()
    }
  }, [session])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fact or Fiction?</h1>
        <StreakCounter streak={streak} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-lg">Loading fact...</span>
          </div>
        ) : (
          <>
            <FactCard fact={fact} result={result} />

            {result ? (
              <GameResult result={result} fact={fact} onNextFact={handleNextFact} />
            ) : (
              <GameControls onAnswer={handleAnswer} disabled={answering} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
