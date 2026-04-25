/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        'neutral-50': '#000000',
        'neutral-100': '#18181b',
        'neutral-200': '#ffffff',
        'neutral-300': '#3f3f47',
        'neutral-400': '#9f9fa9',
        'neutral-500': '#e4e4e7',
        'neutral-600': '#71717b',
        'neutral-700': '#d4d4d8',
        'neutral-800': '#2f2f34',
        'neutral-900': '#f4f4f5',
        background: '#ffffff',
        foreground: '#000000'
    },
    fontFamily: {
        sans: [
            'Inter',
            'sans-serif'
        ]
    },
    fontSize: {
        '14': [
            '14px',
            {
                lineHeight: '20px'
            }
        ],
        '16': [
            '16px',
            {
                lineHeight: 'normal'
            }
        ],
        '60': [
            '60px',
            {
                lineHeight: '60px',
                letterSpacing: '-1.2px'
            }
        ],
        '13.3333': [
            '13.3333px',
            {
                lineHeight: 'normal'
            }
        ]
    },
    spacing: {
        '8': '16px',
        '12': '24px',
        '16': '32px',
        '20': '40px',
        '32': '64px',
        '1px': '1px'
    },
    borderRadius: {
        xs: '2px',
        md: '8px',
        lg: '16px'
    },
    boxShadow: {
        xs: 'rgba(26, 29, 40, 0.06) 0px 1px 2px 0px',
        sm: 'rgb(128, 128, 128) 0px 0px 5px 0px'
    },
    screens: {
        sm: '640px',
        md: '768px',
        '840px': '840px',
        lg: '1024px',
        xl: '1280px',
        '1410px': '1410px',
        '2xl': '1536px'
    },
    transitionDuration: {
        '0': '0s',
        '150': '0.15s',
        '200': '0.2s',
        '250': '0.25s',
        '300': '0.3s'
    },
    transitionTimingFunction: {
        custom: 'cubic-bezier(0.4, 0, 0.2, 1)',
        default: 'ease',
        linear: 'linear'
    },
    container: {
        center: true,
        padding: '24px'
    },
    maxWidth: {
        container: '1920px'
    }
},
  },
};
