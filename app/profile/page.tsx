// app/profile/page.tsx

import { Header } from "@/components/header";
import { ProfileComponent } from "@/components/profile";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";

// Page component MUST be async to await Supabase calls and handle cookies
export default async function ProfilePage() {
  // Create Supabase client for server-side rendering.
  // Assumes createServerClient() correctly initializes with cookies from 'next/headers'
  const supabase = createServerClient();

  // Check if the client creation failed (returned null)
  if (!supabase) {
    // Log this critical error server-side
    console.error("Profile page: Failed to create Supabase client. Check server environment variables.");
    // Redirect or handle appropriately - redirecting home might be safest
    // as this indicates a server configuration problem.
    redirect("/");
    // Alternatively, you could throw an error:
    // throw new Error("Failed to initialize Supabase client.");
  }

  // Use `getUser()` instead of `getSession()` on the server for security.
  // `getUser()` validates the session with Supabase servers.
  const {
    data: { user }, // Destructure the user object directly
    error: userError, // Capture potential errors during user fetching
  } = await supabase.auth.getUser();

  // Check if there was an error fetching the user OR if the user is null
  if (userError || !user) {
    console.error("Profile page: User not found or error fetching user.", userError);
    // Redirect to home page if no valid user session is found
    redirect("/");
  }

  // If we reach here, 'user' contains the authenticated user object
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Pass the verified user object to the ProfileComponent */}
        {/* ProfileComponent likely needs to be a Client Component ("use client") */}
        <ProfileComponent user={user} />
      </div>
    </main>
  );
}