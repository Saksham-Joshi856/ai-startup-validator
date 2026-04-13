import { signUp } from "../lib/auth"

const testAuth = async () => {
    try {
        console.log("Testing Supabase authentication...")
        const testEmail = "testuser@gmail.com"
        const testPassword = "TestPassword123!"

        console.log(`Attempting to sign up with email: ${testEmail}`)
        const { data, error } = await signUp(testEmail, testPassword)

        if (error) {
            console.error("Sign up error:", error)
            return
        }

        console.log("Sign up successful!")
        console.log("User data:", data)
    } catch (error) {
        console.error("Test failed with exception:", error)
    }
}

testAuth()
