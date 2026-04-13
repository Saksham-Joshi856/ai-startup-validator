import { supabase } from "./supabaseClient"

export const createUserProfile = async (userId: string, email: string) => {
    try {
        const { data, error } = await supabase
            .from("profiles")
            .insert([
                {
                    id: userId,
                    email: email,
                    created_at: new Date().toISOString(),
                },
            ])
            .select()

        if (error) {
            console.error("Error creating user profile:", error)
            return { data: null, error }
        }

        console.log("User profile created successfully:", data)
        return { data, error: null }
    } catch (error) {
        console.error("Exception creating user profile:", error)
        return { data: null, error }
    }
}
