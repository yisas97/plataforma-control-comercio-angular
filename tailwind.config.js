/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          '50': '#EFF6FF',
          '100': '#DBEAFE',
          '200': '#BFDBFE',
          '300': '#93C5FD',
          '400': '#60A5FA',
          '500': '#3B82F6',
          '600': '#2563EB',
          '700': '#1D4ED8',
          '800': '#1E40AF',
          '900': '#1E3A8A',
        },
        secondary: {
          DEFAULT: '#64748B',
        },
        success: {
          DEFAULT: '#10B981',
        },
        danger: {
          DEFAULT: '#EF4444',
        },
        warning: {
          DEFAULT: '#F59E0B',
        },
      },
    },
  },
  plugins: [],
}
