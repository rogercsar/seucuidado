import { createClient } from '@supabase/supabase-js'

// Use a fallback for build-time rendering, but require them for client-side execution
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

// A função createClient do Supabase não lança um erro se as chaves estiverem faltando,
// mas as chamadas de API subsequentes falharão.
// Esta verificação garante que a aplicação não funcione sem as chaves no ambiente do cliente.
if (typeof window !== 'undefined' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  throw new Error('Missing Supabase URL or anonymous key. Make sure to set them in your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
