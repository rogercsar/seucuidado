import './globals.css';
import { Nunito_Sans, Poppins } from 'next/font/google';
import React from 'react';

const nunito = Nunito_Sans({ subsets: ['latin'], weight: ['400', '500'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700'] });

export const metadata = {
  title: 'SeuCuidado — Conectando você ao cuidado certo',
  description: 'Plataforma humanizada para agendar profissionais de saúde com confiança.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${nunito.className} bg-snow text-textblue`}>{children}</body>
    </html>
  );
}