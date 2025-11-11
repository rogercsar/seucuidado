import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5CC8FF',
        secondary: '#6FE2B3',
        support: '#E2D6FF',
        snow: '#F8FAFC',
        textblue: '#1C355D',
        highlight: '#FF7E6B',
        darkbg: '#0D1B2A',
        darktext: '#E8F1F2',
      },
      boxShadow: {
        soft: '0 4px 10px rgba(0,0,0,0.08)',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        nunito: ['Nunito Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
      },
    },
  },
  plugins: [],
};

export default config;