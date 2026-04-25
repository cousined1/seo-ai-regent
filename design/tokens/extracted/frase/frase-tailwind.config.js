/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        primary: {
            '50': 'hsl(NaN, NaN%, 97%)',
            '100': 'hsl(NaN, NaN%, 94%)',
            '200': 'hsl(NaN, NaN%, 86%)',
            '300': 'hsl(NaN, NaN%, 76%)',
            '400': 'hsl(NaN, NaN%, 64%)',
            '500': 'hsl(NaN, NaN%, 50%)',
            '600': 'hsl(NaN, NaN%, 40%)',
            '700': 'hsl(NaN, NaN%, 32%)',
            '800': 'hsl(NaN, NaN%, 24%)',
            '900': 'hsl(NaN, NaN%, 16%)',
            '950': 'hsl(NaN, NaN%, 10%)',
            DEFAULT: '#e2e8f0'
        },
        secondary: {
            '50': 'hsl(NaN, NaN%, 97%)',
            '100': 'hsl(NaN, NaN%, 94%)',
            '200': 'hsl(NaN, NaN%, 86%)',
            '300': 'hsl(NaN, NaN%, 76%)',
            '400': 'hsl(NaN, NaN%, 64%)',
            '500': 'hsl(NaN, NaN%, 50%)',
            '600': 'hsl(NaN, NaN%, 40%)',
            '700': 'hsl(NaN, NaN%, 32%)',
            '800': 'hsl(NaN, NaN%, 24%)',
            '900': 'hsl(NaN, NaN%, 16%)',
            '950': 'hsl(NaN, NaN%, 10%)',
            DEFAULT: '#020817'
        },
        accent: {
            '50': 'hsl(NaN, NaN%, 97%)',
            '100': 'hsl(NaN, NaN%, 94%)',
            '200': 'hsl(NaN, NaN%, 86%)',
            '300': 'hsl(NaN, NaN%, 76%)',
            '400': 'hsl(NaN, NaN%, 64%)',
            '500': 'hsl(NaN, NaN%, 50%)',
            '600': 'hsl(NaN, NaN%, 40%)',
            '700': 'hsl(NaN, NaN%, 32%)',
            '800': 'hsl(NaN, NaN%, 24%)',
            '900': 'hsl(NaN, NaN%, 16%)',
            '950': 'hsl(NaN, NaN%, 10%)',
            DEFAULT: '#28a05f'
        },
        'neutral-50': '#ffffff',
        'neutral-100': '#78716c',
        'neutral-200': '#44403c',
        'neutral-300': '#1c1917',
        'neutral-400': '#000000',
        'neutral-500': '#a8a29e',
        'neutral-600': '#57534e',
        background: '#ffffff',
        foreground: '#000000'
    },
    fontFamily: {
        sans: [
            'Inter',
            'sans-serif'
        ],
        heading: [
            'Fraunces',
            'sans-serif'
        ],
        body: [
            'Times New Roman',
            'sans-serif'
        ],
        font3: [
            'system-ui',
            'sans-serif'
        ]
    },
    fontSize: {
        '14': [
            '14px',
            {
                lineHeight: '21px'
            }
        ],
        '15': [
            '15px',
            {
                lineHeight: '22.5px'
            }
        ],
        '16': [
            '16px',
            {
                lineHeight: '24px'
            }
        ],
        '18': [
            '18px',
            {
                lineHeight: '28.8px'
            }
        ],
        '20': [
            '20px',
            {
                lineHeight: '32px'
            }
        ],
        '22': [
            '22px',
            {
                lineHeight: '27.5px'
            }
        ],
        '24': [
            '24px',
            {
                lineHeight: '33.6px'
            }
        ],
        '26': [
            '26px',
            {
                lineHeight: '39px'
            }
        ],
        '28': [
            '28px',
            {
                lineHeight: '42px'
            }
        ],
        '32': [
            '32px',
            {
                lineHeight: '36.8px',
                letterSpacing: '-0.64px'
            }
        ],
        '48': [
            '48px',
            {
                lineHeight: '48px'
            }
        ],
        '70.4': [
            '70.4px',
            {
                lineHeight: '73.92px',
                letterSpacing: '-2.112px'
            }
        ],
        '44.8': [
            '44.8px',
            {
                lineHeight: '51.52px',
                letterSpacing: '-0.896px'
            }
        ],
        '35.84': [
            '35.84px',
            {
                lineHeight: '41.216px',
                letterSpacing: '-0.7168px'
            }
        ],
        '16.64': [
            '16.64px',
            {
                lineHeight: '27.456px'
            }
        ]
    },
    spacing: {
        '1': '2px',
        '24': '48px',
        '28': '56px',
        '32': '64px',
        '51': '102px',
        '64': '128px',
        '88': '176px',
        '92': '184px',
        '104': '208px',
        '131': '262px',
        '144': '288px',
        '149': '298px',
        '164': '328px',
        '77px': '77px',
        '149px': '149px',
        '167px': '167px',
        '247px': '247px'
    },
    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        full: '9999px'
    },
    boxShadow: {
        sm: 'rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.03) 0px 1px 2px 0px',
        md: 'rgba(0, 0, 0, 0.15) 0px 4px 12px 0px',
        lg: 'rgba(40, 160, 95, 0.3) 0px 4px 14px 0px',
        xl: 'rgba(0, 0, 0, 0.18) 0px 30px 60px -15px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px'
    },
    screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        '1400px': '1400px'
    },
    transitionDuration: {
        '80': '0.08s',
        '150': '0.15s',
        '160': '0.16s',
        '200': '0.2s',
        '240': '0.24s',
        '300': '0.3s',
        '320': '0.32s',
        '400': '0.4s',
        '700': '0.7s'
    },
    transitionTimingFunction: {
        custom: 'cubic-bezier(0, 0, 0.2, 1)'
    },
    container: {
        center: true,
        padding: '0px'
    },
    maxWidth: {
        container: '900px'
    }
},
  },
};
