import { createClient } from '@supabase/supabase-js'

// Create a simple client without strict typing for now
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabaseClient = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Create a mock client for build-time when env vars are not available
const mockClient = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null }, error: new Error('Mock client') }),
    signUp: async () => ({ data: { user: null }, error: new Error('Mock client') }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: new Error('Mock client') })
      }),
      order: () => ({
        limit: async () => ({ data: [], error: null })
      })
    }),
    insert: () => ({
      select: async () => ({ data: [], error: null })
    }),
    update: () => ({
      eq: async () => ({ data: null, error: null })
    })
  })
}

export const createSimpleClient = () => supabaseClient || mockClient
