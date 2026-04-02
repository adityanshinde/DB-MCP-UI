import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './hooks/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}', './types/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#0f172a',
        panelSoft: '#111827',
        accent: '#38bdf8'
      }
    }
  },
  plugins: []
};

export default config;
