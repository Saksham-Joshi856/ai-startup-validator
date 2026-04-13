import { createClient } from "@supabase/supabase-js"


import { config } from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// Load environment variables at module initialization
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
config({ path: path.resolve(__dirname, "../../.env.local") })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl) {
    throw new Error("Missing environment variable: SUPABASE_URL")
}

if (!supabaseAnonKey) {
    throw new Error("Missing environment variable: SUPABASE_ANON_KEY")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
