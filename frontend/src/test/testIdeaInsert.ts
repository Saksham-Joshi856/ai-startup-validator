import { createStartupIdea } from "../lib/ideaService"

// Placeholder for Supabase user UUID - replace with actual user ID
const userId = "13664e05-7f8d-468b-8085-7016ac9acb82"

const testIdeaInsert = async () => {
    try {
        console.log("Testing idea insertion into Supabase...")
        console.log(`Using userId: ${userId}\n`)

        // Call createStartupIdea with placeholder user ID
        const { data, error } = await createStartupIdea(
            userId,
            "AI Resume Builder",
            "AI tool that generates optimized resumes automatically"
        )

        if (error) {
            console.log("Insert error:")
            console.log(JSON.stringify(error, null, 2))
            return
        }

        console.log("Idea inserted successfully")
        console.log("Returned data:")
        console.log(JSON.stringify(data, null, 2))
    } catch (error) {
        console.log("Insert error:")
        console.error(error)
    }
}

// Execute the test function
testIdeaInsert()
