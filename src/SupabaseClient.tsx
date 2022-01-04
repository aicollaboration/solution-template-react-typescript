import { createClient } from '@supabase/supabase-js'

export function getClient() {
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
    const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Please set the REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY environment variables')
    }
    return createClient(supabaseUrl, supabaseAnonKey)
}