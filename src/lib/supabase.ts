import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.BASE_URL!
const supabaseKey = process.env.SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)