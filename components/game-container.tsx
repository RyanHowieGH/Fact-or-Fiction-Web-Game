// components/game-container.tsx

"use client"

import { useState, useEffect, useCallback } from "react"
import { FactCard } from "@/components/fact-card"
import { GameControls } from "@/components/game-controls"
// Keep GameResult if you want to display the correct answer text, otherwise remove
// import { GameResult } from "@/components/game-result"
import { StreakCounter } from "@/components/streak-counter"
import { useSupabase } from "@/components/supabase-provider"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

// Define the structure of a fact object
type Fact = {
  text: string
  isTrue: boolean
  originalText?: string // Optional: If your API provides the original before modification
}


// Duration to show the result before fetching the next fact (in milliseconds)
const RESULT_DISPLAY_DURATION = 1500;

export function GameContainer() {
  
  // --- State Variables ---
  const [fact, setFact] = useState<Fact | null>(null); // Holds the current fact
  const [loading, setLoading] = useState(true); // True while fetching a new fact
  const [answering, setAnswering] = useState(false); // True during the result display + fetch transition
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null); // Result of the last answer
  const [streak, setStreak] = useState(0); // Current user streak

  console.log("[GameContainer Render] answering:", answering, "loading:", loading, "result:", result); // <-- ADD THIS

  // --- Hooks ---
  const { session, supabase } = useSupabase(); // Get Supabase client and session
  const { toast } = useToast(); // For showing notifications

  // --- Core Functions ---

  // Fetches a new random fact from the API and resets the game state
  const fetchFactAndReset = useCallback(async () => {
    setLoading(true);    // Show loading spinner
    setResult(null);     // Clear previous result
    setAnswering(false); // Re-enable answer buttons for the new fact

    try {
      const response = await fetch("/api/facts/random");
      if (!response.ok) {
        // Attempt to get error message from response body if possible
        let errorMsg = "Failed to fetch fact";
        try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
        } catch (_) { /* Ignore parsing error */ }
        throw new Error(errorMsg);
      }

      const data: Fact = await response.json();
      setFact(data); // Update the fact state

    } catch (error: any) {
      console.error("Error fetching fact:", error);
      toast({
        title: "Error Loading Fact",
        description: error.message || "Could not load a new fact. Please try refreshing.",
        variant: "destructive",
      });
      // Optional: You might want to set the fact to null or show an error state
      // setFact(null);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  }, [toast]); // Include toast in dependency array for useCallback

  // Handles the user clicking "True" or "False"
  const handleAnswer = async (answer: boolean) => {
    // Prevent answering if no fact loaded or already processing an answer
    if (!fact || answering) return;

    setAnswering(true); // Disable controls immediately

    const isCorrect = answer === fact.isTrue;
    setResult(isCorrect ? "correct" : "incorrect"); // Show feedback

    // --- Streak Logic ---
    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);

    // --- Database Update Logic (if logged in) ---
    if (session?.user) {
      try {
        // Fetch only highest_streak needed for comparison
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("highest_streak")
          .eq("id", session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = row not found, handle potentially?
           throw profileError;
        }

        let highestStreak = profile?.highest_streak || 0;
        if (newStreak > highestStreak) {
          highestStreak = newStreak;
        }

        // Update current and potentially highest streak
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            current_streak: newStreak,
            highest_streak: highestStreak,
          })
          .eq("id", session.user.id);

         if (updateError) throw updateError;

      } catch (error: any) {
        console.error("Error updating streak in database:", error);
        toast({
            title: "Streak Sync Error",
            description: "Could not save your streak progress. Gameplay continues locally.",
            variant: "destructive"
        })
      }
    }
    // --- End Database Update ---
    console.log(`[handleAnswer] Answer processed. isCorrect: ${isCorrect}. Setting timeout.`); // <-- ADD THIS
    setTimeout(() => {
      console.log("[handleAnswer] Timeout finished. Calling fetchFactAndReset()."); // <-- ADD THIS
      fetchFactAndReset();
    }, RESULT_DISPLAY_DURATION);

    // Wait to show the result, then fetch the next fact
    setTimeout(() => {
      fetchFactAndReset(); // Fetch the next fact and reset states
    }, RESULT_DISPLAY_DURATION);
  };

  // --- Effects ---

  // Fetch initial fact on component mount
  useEffect(() => {
    fetchFactAndReset();
  }, [fetchFactAndReset]); // fetchFactAndReset is stable due to useCallback

  // Fetch initial streak when session changes (user logs in/out)
  useEffect(() => {
    if (session?.user) {
      const getInitialStreak = async () => {
        try {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("current_streak")
            .eq("id", session.user.id)
            .single();

          if (error && error.code !== 'PGRST116') throw error; // Ignore 'row not found'

          setStreak(profile?.current_streak || 0);

        } catch (error: any) {
          console.error("Error fetching initial streak:", error);
          toast({
            title: "Streak Load Error",
            description: "Could not load your saved streak.",
            variant: "destructive"
          })
        }
      };
      getInitialStreak();
    } else {
      // Reset streak if user logs out
      setStreak(0);
    }
  }, [session, supabase, toast]); // Dependencies for fetching streak

  // --- Render Logic ---
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header section with title and streak counter */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fact or Fiction?</h1>
        <StreakCounter streak={streak} />
      </div>

      {/* Main game card area */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden min-h-[200px] flex flex-col">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-grow justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-lg text-gray-600 dark:text-gray-300">Loading fact...</span>
          </div>
        )}

        {/* Fact Display State (when not loading) */}
        {!loading && fact && (
          <>
            {/* Fact Card: Shows the fact text and applies correct/incorrect styling based on 'result' */}
            <FactCard fact={fact} result={result} />

            {/* Controls OR Result Feedback Area */}
            <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
              {result === null ? (
                // Show True/False buttons when waiting for an answer
                <GameControls onAnswer={handleAnswer} disabled={answering} />
              ) : (
                // Show result feedback text during the delay before the next fact
                <div className={`text-center text-lg font-semibold ${result === 'correct' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {result === 'correct' ? 'Correct!' : 'Incorrect!'}
                  {/* Optional: Add loading indicator here too if desired */}
                  {/* <Loader2 className="inline-block h-5 w-5 animate-spin ml-2" /> */}
                </div>
              )}
            </div>
          </>
        )}

         {/* Error State (Optional): Handle case where initial fact load fails */}
         {!loading && !fact && (
             <div className="flex flex-grow justify-center items-center p-12 text-center">
                 <p className="text-red-600 dark:text-red-400">
                     Could not load a fact. Please try refreshing the page.
                 </p>
             </div>
         )}
      </div>
    </div>
  );
}