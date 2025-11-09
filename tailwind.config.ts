import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Habilitando o modo escuro
  theme: {
    extend: {
      colors: {
        primary: "#5CC8FF", // Azul Serenity
        secondary: "#6FE2B3", // Verde Menta
        support: "#E2D6FF", // Lilás Claro
        neutral: "#F8FAFC", // Cinza Neve
        "dark-text": "#1C355D", // Azul Escuro
        highlight: "#FF7E6B", // Coral Suave
        // Cores para o modo escuro
        "dark-bg": "#0D1B2A",
        "dark-text-main": "#E8F1F2",
      },
      fontFamily: {
        sans: ["Nunito Sans", ...fontFamily.sans],
        poppins: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        lg: "12px",
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #5CC8FF, #6FE2B3)',
      }
    },
  },
  plugins: [],
};
export default config;
