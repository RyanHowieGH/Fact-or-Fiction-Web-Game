import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "")

export async function GET() {
  try {
    // Fetch a random fact from API Ninjas
    const response = await fetch("https://api.api-ninjas.com/v1/facts", {
      headers: {
        "X-Api-Key": process.env.API_NINJAS_API_KEY || "",
      },
    })

    if (!response.ok) {
      throw new Error(`API Ninjas responded with status: ${response.status}`)
    }

    const data = await response.json()
    const originalFact = data[0]?.fact

    if (!originalFact) {
      throw new Error("No fact returned from API")
    }

    // Randomly decide if we should return a true or false fact
    const shouldBeFalse = Math.random() > 0.5

    if (!shouldBeFalse) {
      // Return the original fact as true
      return NextResponse.json({
        text: originalFact,
        isTrue: true,
      })
    } else {
      // Use Google Gemini to create a false version of the fact
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const prompt = `
        I have a true fact: "${originalFact}"
        
        Please create a false version of this fact that sounds believable but contains subtle inaccuracies.
        The false version should be approximately the same length and style as the original.
        Only return the modified fact text, nothing else.
      `

      const result = await model.generateContent(prompt)
      const falseFact = result.response.text().trim()

      return NextResponse.json({
        text: falseFact,
        isTrue: false,
        originalText: originalFact,
      })
    }
  } catch (error) {
    console.error("Error fetching or processing fact:", error)
    return NextResponse.json({ error: "Failed to fetch or process fact" }, { status: 500 })
  }
}
