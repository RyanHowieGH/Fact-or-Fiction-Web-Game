"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/components/supabase-provider"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { Flame, LogOut, Trophy, UserIcon } from "lucide-react"

type ProfileProps = {
  user: User
}

export function ProfileComponent({ user }: ProfileProps) {
  const [profile, setProfile] = useState<{
    username: string
    current_streak: number
    highest_streak: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const router = useRouter()

  useState(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, current_streak, highest_streak")
          .eq("id", user.id)
          .single()

        if (error) throw error

        setProfile(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  })

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "An error occurred while signing out.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Profile</CardTitle>
          <CardDescription>View your game statistics and account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Username</div>
              <div className="font-medium text-lg">{profile?.username || "Loading..."}</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Current Streak</div>
              <div className="font-medium text-lg">{profile?.current_streak || 0}</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Highest Streak</div>
              <div className="font-medium text-lg">{profile?.highest_streak || 0}</div>
            </div>
          </div>

          <div className="pt-4">
            <Button variant="outline" onClick={handleSignOut} className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
