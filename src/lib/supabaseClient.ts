import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Flag para verificar se as chaves estão presentes.
export const areSupabaseKeysSet = !!(supabaseUrl && supabaseAnonKey)

// Cria o cliente apenas se as chaves estiverem presentes.
// Para o build, ele pode usar chaves vazias temporariamente, mas a flag acima controlará a UI.
export const supabase = areSupabaseKeysSet
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : {} as any; // Devolve um objeto vazio se as chaves não estiverem setadas
