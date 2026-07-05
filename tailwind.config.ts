import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: 'var(--color-navy-900)',
          800: 'var(--color-navy-800)',
          700: 'var(--color-navy-700)',
          600: 'var(--color-navy-600)'
        },
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        ink: 'var(--color-ink)',
        line: 'var(--color-line)',
        soft: 'var(--color-bg-soft)'
      },
      maxWidth: { container: '1440px' },
      borderRadius: { card: '14px', lg2: '24px' },
      boxShadow: {
        card: '0 6px 24px rgba(10,15,30,.08)',
        hover: '0 12px 40px rgba(10,15,30,.16)'
      }
    }
  },
  plugins: []
};
export default config;
