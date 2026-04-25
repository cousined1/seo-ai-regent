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
            DEFAULT: '#580101'
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
            DEFAULT: '#e0e9f2'
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
            DEFAULT: '#ffc2c2'
        },
        'neutral-50': '#000000',
        'neutral-100': '#f4f4f2',
        'neutral-200': '#ffffff',
        'neutral-300': '#c1c1c1',
        background: '#f4f4f2',
        foreground: '#000000'
    },
    fontFamily: {
        sans: [
            'GT-Pressura-Mono',
            'sans-serif'
        ],
        body: [
            'ui-sans-serif',
            'sans-serif'
        ]
    },
    fontSize: {
        '12': [
            '12px',
            {
                lineHeight: '14px'
            }
        ],
        '14': [
            '14px',
            {
                lineHeight: '20px'
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
                lineHeight: '28px'
            }
        ],
        '74.2362': [
            '74.2362px',
            {
                lineHeight: '89.0834px'
            }
        ],
        '43.3472': [
            '43.3472px',
            {
                lineHeight: '65.0208px'
            }
        ],
        '36.2448': [
            '36.2448px',
            {
                lineHeight: '43.4938px'
            }
        ],
        '30.312': [
            '30.312px',
            {
                lineHeight: '36.3744px'
            }
        ],
        '21.217': [
            '21.217px',
            {
                lineHeight: '31.8254px'
            }
        ],
        '17.7565': [
            '17.7565px',
            {
                lineHeight: '17.7565px'
            }
        ],
        '14.865': [
            '14.865px',
            {
                lineHeight: '14.865px'
            }
        ],
        '12.447': [
            '12.447px',
            {
                lineHeight: '18.6706px',
                letterSpacing: '0.622352px'
            }
        ]
    },
    spacing: {
        '11': '22px',
        '16': '32px',
        '19': '38px',
        '27': '54px',
        '39': '78px',
        '53': '106px',
        '58': '116px',
        '78': '156px',
        '1px': '1px',
        '15px': '15px',
        '63px': '63px',
        '119px': '119px'
    },
    borderRadius: {
        xs: '2px',
        md: '6px'
    },
    boxShadow: {
        sm: 'rgb(128, 128, 128) 0px 0px 5px 0px',
        xs: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'
    },
    transitionDuration: {
        '200': '0.2s',
        '300': '0.3s'
    },
    transitionTimingFunction: {
        custom: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    container: {
        center: true,
        padding: '38.4563px'
    },
    maxWidth: {
        container: '1360px'
    }
},
  },
};
