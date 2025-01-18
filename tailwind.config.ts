import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        base: "var(--base)",
        offbase: "var(--offbase)",
        accent: "var(--accent)",
        muted: "var(--muted)",
      },
    },
  },
  plugins: [],
} satisfies Config;
