import React, { createContext, useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabaseClient"
import { createUserProfile } from "@/lib/profileService"

interface AuthContextType {
    user: User | null
    loading: boolean
    isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAuthenticated: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // Helper function to ensure user profile exists
    const ensureUserProfile = async (userId: string, email: string) => {
        try {
            console.log("🔍 Checking profile for user:", email)

            // Check if profile already exists
            const { data: existingProfile, error: checkError } = await supabase
                .from("profiles")
                .select("id")
                .eq("id", userId)
                .maybeSingle()

            if (checkError && checkError.code !== "PGRST116") {
                console.error("❌ Error checking profile:", checkError)
                return
            }

            // If profile doesn't exist, create it
            if (!existingProfile) {
                console.log("📝 Creating new profile for:", email)
                const { data, error } = await createUserProfile(userId, email)
                if (error) {
                    console.error("❌ Error creating profile:", error)
                } else {
                    console.log("✅ User profile created successfully for:", email)
                }
            } else {
                console.log("✅ User profile already exists for:", email)
            }
        } catch (error) {
            console.error("❌ Exception in ensureUserProfile:", error)
        }
    }

    useEffect(() => {
        let isMounted = true

        const initializeAuth = async () => {
            try {
                console.log("🔄 Initializing auth...")

                // Check if we're coming back from OAuth redirect
                const urlHash = window.location.hash
                if (urlHash) {
                    console.log("🔐 OAuth redirect detected, waiting for session...")
                    // Wait a bit for Supabase to process the OAuth callback
                    await new Promise(resolve => setTimeout(resolve, 1000))
                }

                // Get current session
                const { data, error: sessionError } = await supabase.auth.getSession()
                if (sessionError) {
                    console.error("❌ Session error:", sessionError)
                } else {
                    console.log("📊 Current session user:", data?.session?.user?.email || "undefined")
                }

                const currentUser = data?.session?.user ?? null

                if (isMounted) {
                    setUser(currentUser)

                    // Create profile for user if they don't have one yet
                    if (currentUser) {
                        console.log("👤 User found:", currentUser.email)
                        await ensureUserProfile(currentUser.id, currentUser.email || "")
                    } else {
                        console.log("❌ No user found in session")
                    }

                    // Set loading to false after a short delay to ensure state is ready
                    setTimeout(() => {
                        if (isMounted) {
                            console.log("✅ Auth initialization complete")
                            setLoading(false)
                        }
                    }, 500)
                }
            } catch (error) {
                console.error("❌ Auth initialization error:", error)
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        initializeAuth()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("🔐 Auth state changed:", event)

            const currentUser = session?.user ?? null

            if (isMounted) {
                setUser(currentUser)
            }

            console.log("📋 Event:", event, "| User Email:", currentUser?.email || "none")

            // Create user profile on auth state change if user exists
            if (currentUser) {
                console.log("👤 Processing user from auth event:", currentUser.email)
                await ensureUserProfile(currentUser.id, currentUser.email || "")
            } else {
                console.log("ℹ️ Auth event had no user")
            }
        })

        return () => {
            isMounted = false
            subscription?.unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}
