import { supabase } from "./supabaseClient"

/**
 * 🔍 OAuth Debugging Script
 * Run this to check if Google OAuth is properly configured
 */

export const debugOAuthSetup = async () => {
    console.log("=" * 60)
    console.log("🔍 OAUTH CONFIGURATION DEBUG")
    console.log("=" * 60)

    try {
        // 1. Check Supabase connection
        console.log("\n1️⃣ Checking Supabase Client...")
        console.log("✅ URL:", import.meta.env.VITE_SUPABASE_URL)
        console.log("✅ Key present:", !!import.meta.env.VITE_SUPABASE_ANON_KEY)

        // 2. Check current session
        console.log("\n2️⃣ Checking Current Session...")
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
            console.error("❌ Session Error:", sessionError)
        } else {
            console.log("✅ Session exists:", !!sessionData?.session)
            console.log("✅ User:", sessionData?.session?.user?.email || "NONE")
        }

        // 3. Get auth providers
        console.log("\n3️⃣ Checking OAuth Providers...")
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        console.log("User data error:", userError)

        // 4. Test OAuth signIn
        console.log("\n4️⃣ Testing Google OAuth SignIn Flow...")
        console.log("⏳ Attempting OAuth redirect...")
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/`,
            },
        })

        if (error) {
            console.error("❌ OAuth Error:", error)
            console.error("Error Code:", error.code)
            console.error("Error Status:", error.status)
            console.error("Error Details:", error.message)
        } else {
            console.log("✅ OAuth Data:", data)
            console.log("⏳ You should be redirected to Google login page...")
        }
    } catch (error) {
        console.error("❌ Debug Exception:", error)
    }

    console.log("\n" + "=" * 60)
    console.log("🔍 END DEBUG")
    console.log("=" * 60)
}

// Export for manual testing in console
window.debugOAuth = debugOAuthSetup
