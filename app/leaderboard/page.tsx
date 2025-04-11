import { Header } from "@/components/header"
import { Leaderboard } from "@/components/leaderboard"

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Leaderboard />
      </div>
    </main>
  )
}
