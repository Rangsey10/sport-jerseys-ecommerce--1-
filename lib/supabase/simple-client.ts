import { createClient } from '@supabase/supabase-js'

// Create a simple client without strict typing for now
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

export const createSimpleClient = () => supabaseClient
