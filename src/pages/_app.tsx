import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import Layout from '@/components/Layout'
import { AuthProvider } from '@/lib/AuthContext'
import Head from 'next/head'
import { areSupabaseKeysSet } from '@/lib/supabaseClient'
import ConfigError from '@/components/ConfigError'

export default function App({ Component, pageProps }: AppProps) {
  // Se as chaves do Supabase não estiverem configuradas, renderiza a tela de erro.
  if (!areSupabaseKeysSet) {
    return <ConfigError />
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <Head>
          <title>SeuCuidado</title>
          <meta name="description" content="Conectando você ao cuidado certo." />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  )
}
