import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './public/assets/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontSize: {
        mxl: ['1,375rem', '2.125rem'],
      },
      colors: {
        'primary': '#7F56D9',
        'op': {
          neutral: {
            300: '#CBD5E0',
          },
          red: {
            100: '#F7F0FF',
          },
        },
        'gray': {
          50: '#FBFCFE',
          100: '#F2F3F8',
          200: '#E0E2EB',
          300: '#F2F4F7',
          400: '#636779',
          500: '#98A2B3',
          600: '#404454',
          700: '#0F111A',
          placeholder: '#667085',
          border: '#EAECF0',
        },
        'blue': {
          foreground: '#3374DB',
          background: '#D6E4FF',
          link: '#3374DB',
        },
        'dark': {
          500: '#05060B',
          600: '#101828',
          900: '#050608',
        },
        'deep': {
          250: '#475467',
        },
        'wite': {
          hover: '#F9FAFB',
          disabled: {
            border: '#EAECF0',
          },
        },
        'status': {
          border: {
            success: '#75E0A7',
            error: '#BE99FF',
            expired: '#FEC84B',
          },
          text: {
            error: '#7504FF',
            expired: '#DC6803',
          },
          bg: {
            error: '#F6F2FE',
            expired: '#FFFAEB',
          },
        },
        'category-tab': {
          active: '#E6D1FF',
          inactive: '#FBFCFE',
        },
        'voting': { // voting status badge
          bg: '#ECFDF3',
          text: '#079455',
          border: '#17B26A',
        },
        'main': {
          title: '#6941C6',
          hover: '#53389E',
        },
      },
      fontFamily: {
        sans: ['"Inter var", sans-serif'],
      },
      boxShadow: {
        'tooltip-shadow': 'box-shadow: 0px 4px 6px -2px #10182808,box-shadow: 0px 12px 16px -4px #10182814',
        'filter-shadow': 'box-shadow: 0px 1px 2px 0px #1018280F,box-shadow: 0px 1px 3px 0px #1018281A',
        'wite-focus-shadow': 'box-shadow: 0px 0px 0px 4px #98A2B324,box-shadow: 0px 1px 2px 0px #1018280D',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'rating-illustration': 'url(\'/assets/images/rating-bg.svg\')',
        'conflict-loading': 'url(\'/assets/images/loading-bg.svg\')',
        'good-rating': 'url(\'/assets/images/good-rating-bg.svg\')',
        'ballot': 'url(\'/assets/images/ballot-bg.svg\')',
        'voting-power': 'url(\'/assets/images/bg-voting-power.svg\')',
        'badge-modal': 'url(\'/assets/images/badge-modal-cover.svg\')',
        'river-left-right': 'url(\'/assets/images/river-left.svg\'),url(\'/assets/images/river-right.svg\')',
      },
      backgroundPosition: {
        river: 'left top,right top',
      },
      backgroundSize: {
        'river-left-right': '50% auto',
      },

      screens: {
        xxsl: { max: '1024px' },
        xsl: { max: '1280px' },
        sl: { max: '1550px' },
        l: { max: '1920px' },
      },
      scale: {
        210: '2.1',
      },
    },
  },
  plugins: [],
};
export default config;
