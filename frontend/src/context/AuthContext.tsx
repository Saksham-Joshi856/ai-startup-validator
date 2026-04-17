import React, { createContext, useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabaseClient"

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


    useEffect(() => {
        let isMounted = true
        let initializationTimeout: NodeJS.Timeout

        const initializeAuth = async () => {
            try {
                console.log("🔄 Initializing auth...")

                // Set a safety timeout to prevent infinite loading (10 seconds max)
                initializationTimeout = setTimeout(() => {
                    if (isMounted) {
                        console.warn("⏱️ Auth initialization timeout - proceeding without user")
                        setLoading(false)
                    }
                }, 10000)

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

                    if (currentUser) {
                        console.log("👤 User found:", currentUser.email)
                    } else {
                        console.log("❌ No user found in session")
                    }

                    // Clear the timeout and set loading to false
                    clearTimeout(initializationTimeout)
                    console.log("✅ Auth initialization complete")
                    setLoading(false)
                }
            } catch (error) {
                console.error("❌ Auth initialization error:", error)
                clearTimeout(initializationTimeout)
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
        })

        return () => {
            isMounted = false
            clearTimeout(initializationTimeout)
            subscription?.unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}
