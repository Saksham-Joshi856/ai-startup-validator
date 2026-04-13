import { createStartupIdea } from "../lib/ideaService"

const testIdeaCreation = async () => {
    try {
        console.log("Testing Startup Idea Creation...")

        // Test with provided parameters
        const userId = "13664e05-7f8d-468b-8085-7016ac9acb82"
        const ideaTitle = "AI Resume Builder"
        const ideaDescription = "AI tool that generates optimized resumes"

        console.log(`\nCreating startup idea with parameters:`)
        console.log(`  - User ID: ${userId}`)
        console.log(`  - Title: ${ideaTitle}`)
        console.log(`  - Description: ${ideaDescription}\n`)

        const { data, error } = await createStartupIdea(userId, ideaTitle, ideaDescription)

        console.log("\nResult:")
        console.log("Data:", JSON.stringify(data, null, 2))
        if (error) {
            console.log("Error:", JSON.stringify(error, null, 2))
        }
    } catch (error) {
        console.error("Test failed with exception:", error)
    }
}

testIdeaCreation()
