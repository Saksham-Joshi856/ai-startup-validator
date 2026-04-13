import { supabase } from "./supabaseClient"
import { createUserProfile } from "./profileService"

export const signUp = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            console.error("Sign up error:", error)
            return { data: null, error }
        }

        // Create user profile after successful sign up
        if (data?.user?.id) {
            const profileResult = await createUserProfile(data.user.id, email)
            if (profileResult.error) {
                console.error("Profile creation failed, but user was created:", profileResult.error)
                // Still return user data even if profile creation fails
                return { data, error: null }
            }
        }

        return { data, error: null }
    } catch (error) {
        console.error("Sign up exception:", error)
        return { data: null, error }
    }
}

export const signIn = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { data, error }
    } catch (error) {
        return { data: null, error }
    }
}

export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut()
        return { error }
    } catch (error) {
        return { error }
    }
}

export const signInWithGoogle = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/`,
            },
        })
        return { data, error }
    } catch (error) {
        console.error("Google sign in error:", error)
        return { data: null, error }
    }
}

export const getCurrentSession = async () => {
    try {
        const { data, error } = await supabase.auth.getSession()
        return { data, error }
    } catch (error) {
        console.error("Get session error:", error)
        return { data: null, error }
    }
}

export const getCurrentUser = async () => {
    try {
        const { data, error } = await supabase.auth.getUser()
        return { data, error }
    } catch (error) {
        console.error("Get user error:", error)
        return { data: null, error }
    }
}
