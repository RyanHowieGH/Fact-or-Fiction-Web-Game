import { Header } from "@/components/header"
import { ProfileComponent } from "@/components/profile"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"

export default async function ProfilePage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <ProfileComponent user={session.user} />
      </div>
    </main>
  )
}
