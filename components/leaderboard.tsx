"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabase } from "@/components/supabase-provider"
import { Loader2, Trophy } from "lucide-react"

type LeaderboardEntry = {
  id: string
  username: string
  highest_streak: number
}

export function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { supabase } = useSupabase()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, username, highest_streak")
          .order("highest_streak", { ascending: false })
          .limit(20)

        if (error) throw error

        setLeaders(data || [])
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [supabase])

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardTitle className="text-2xl flex items-center">
            <Trophy className="mr-2 h-6 w-6" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2 text-lg">Loading leaderboard...</span>
            </div>
          ) : leaders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No entries yet. Be the first to make it to the leaderboard!
            </div>
          ) : (
            <div className="divide-y">
              {leaders.map((leader, index) => (
                <div
                  key={leader.id}
                  className={`flex items-center p-4 ${
                    index === 0
                      ? "bg-yellow-50 dark:bg-yellow-900/20"
                      : index === 1
                        ? "bg-gray-50 dark:bg-gray-800/50"
                        : index === 2
                          ? "bg-amber-50 dark:bg-amber-900/20"
                          : ""
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 font-bold ${
                      index === 0
                        ? "bg-yellow-400 text-yellow-900"
                        : index === 1
                          ? "bg-gray-300 text-gray-800"
                          : index === 2
                            ? "bg-amber-600 text-amber-50"
                            : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{leader.username}</div>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-lg">{leader.highest_streak}</span>
                    <span className="ml-1 text-sm text-gray-500">streak</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
