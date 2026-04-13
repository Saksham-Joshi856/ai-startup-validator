import { supabase } from "../lib/supabaseClient"

const testInsert = async () => {
    try {
        console.log("Starting direct Supabase insert test...\n")

        console.log("Attempting to insert with just user_id...")
        const { data, error } = await supabase
            .from("startup_ideas")
            .insert([
                {
                    user_id: "PASTE_SUPABASE_USER_UUID_HERE",
                },
            ])
            .select()

        if (error) {
            console.log("Insert error:")
            console.log(JSON.stringify(error, null, 2))
        } else {
            console.log("Insert success:")
            console.log(JSON.stringify(data, null, 2))
        }
    } catch (error) {
        console.log("Insert error:")
        console.error(error)
    }
}

// Execute the test function
testInsert()
