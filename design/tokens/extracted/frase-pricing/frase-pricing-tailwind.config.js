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
        'neutral-50': '#44403c',
        'neutral-100': '#ffffff',
        'neutral-200': '#78716c',
        'neutral-300': '#000000',
        'neutral-400': '#57534e',
        'neutral-500': '#1c1917',
        'neutral-600': '#d6d3d1',
        'neutral-700': '#a8a29e',
        background: '#ffffff',
        foreground: '#000000'
    },
    fontFamily: {
        sans: [
            'Inter',
            'sans-serif'
        ],
        body: [
            'Times New Roman',
            'sans-serif'
        ],
        font2: [
            'Fraunces',
            'sans-serif'
        ],
        font3: [
            'system-ui',
            'sans-serif'
        ]
    },
    fontSize: {
        '12': [
            '12px',
            {
                lineHeight: '18px',
                letterSpacing: '0.12px'
            }
        ],
        '13': [
            '13px',
            {
                lineHeight: '19.5px'
            }
        ],
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
        '17': [
            '17px',
            {
                lineHeight: '28.9px'
            }
        ],
        '18': [
            '18px',
            {
                lineHeight: '30.6px'
            }
        ],
        '22': [
            '22px',
            {
                lineHeight: '33px'
            }
        ],
        '26': [
            '26px',
            {
                lineHeight: '39px',
                letterSpacing: '-0.52px'
            }
        ],
        '28': [
            '28px',
            {
                lineHeight: '42px',
                letterSpacing: '-0.56px'
            }
        ],
        '42': [
            '42px',
            {
                lineHeight: '42px',
                letterSpacing: '-1.26px'
            }
        ],
        '64': [
            '64px',
            {
                lineHeight: '69.12px',
                letterSpacing: '-1.92px'
            }
        ],
        '44.8': [
            '44.8px',
            {
                lineHeight: '51.52px',
                letterSpacing: '-0.896px'
            }
        ],
        '38.4': [
            '38.4px',
            {
                lineHeight: '57.6px',
                letterSpacing: '-0.768px'
            }
        ],
        '15.36': [
            '15.36px',
            {
                lineHeight: '25.344px'
            }
        ]
    },
    spacing: {
        '24': '48px',
        '28': '56px',
        '32': '64px',
        '36': '72px',
        '51': '102px',
        '54': '108px',
        '104': '208px',
        '129': '258px',
        '134': '268px',
        '139': '278px',
        '144': '288px',
        '164': '328px',
        '1px': '1px',
        '77px': '77px',
        '471px': '471px'
    },
    borderRadius: {
        md: '8px',
        lg: '16px',
        xl: '24px',
        full: '9999px'
    },
    boxShadow: {
        sm: 'rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.03) 0px 1px 2px 0px',
        md: 'rgba(0, 0, 0, 0.15) 0px 4px 12px 0px',
        lg: 'rgba(40, 160, 95, 0.12) 0px 4px 20px 0px, rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.03) 0px 1px 2px 0px'
    },
    screens: {
        sm: '640px',
        '1400px': '1400px'
    },
    transitionDuration: {
        '150': '0.15s',
        '200': '0.2s',
        '300': '0.3s',
        '500': '0.5s',
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
