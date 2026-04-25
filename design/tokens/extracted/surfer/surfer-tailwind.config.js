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
            DEFAULT: '#ff5b49'
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
            DEFAULT: '#783afb'
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
            DEFAULT: '#ff5b49'
        },
        'neutral-50': '#ffffff',
        'neutral-100': '#000000',
        'neutral-200': '#f4f4f5',
        'neutral-300': '#dddddd',
        'neutral-400': '#2f2f34',
        'neutral-500': '#18181b',
        'neutral-600': '#444444',
        'neutral-700': '#09090b',
        'neutral-800': '#999999',
        'neutral-900': '#666666',
        background: '#000000',
        foreground: '#000000'
    },
    fontFamily: {
        sans: [
            'Inter Variable',
            'sans-serif'
        ],
        body: [
            'system-ui',
            'sans-serif'
        ],
        font2: [
            'sans-serif',
            'sans-serif'
        ]
    },
    fontSize: {
        '18': [
            '18px',
            {
                lineHeight: '60px'
            }
        ],
        '20': [
            '20px',
            {
                lineHeight: '20px'
            }
        ],
        '78.3351': [
            '78.3351px',
            {
                lineHeight: '86.1686px',
                letterSpacing: '-1.95838px'
            }
        ],
        '62.8639': [
            '62.8639px',
            {
                lineHeight: '69.1503px'
            }
        ],
        '41.2826': [
            '41.2826px',
            {
                lineHeight: '49.5391px'
            }
        ],
        '39.1675': [
            '39.1675px',
            {
                lineHeight: '47.001px',
                letterSpacing: '-0.940021px'
            }
        ],
        '31.334': [
            '31.334px',
            {
                lineHeight: '47.001px'
            }
        ],
        '23.5005': [
            '23.5005px',
            {
                lineHeight: '30.5507px',
                letterSpacing: '-0.626681px'
            }
        ],
        '22.3647': [
            '22.3647px',
            {
                lineHeight: '29.0741px'
            }
        ],
        '22.2472': [
            '22.2472px',
            {
                lineHeight: '27.8089px'
            }
        ],
        '19.5838': [
            '19.5838px',
            {
                lineHeight: '29.3756px'
            }
        ],
        '18.3937': [
            '18.3937px',
            {
                lineHeight: '27.5906px'
            }
        ],
        '17.2337': [
            '17.2337px',
            {
                lineHeight: '21.5421px'
            }
        ],
        '17.0304': [
            '17.0304px',
            {
                lineHeight: '25.5455px'
            }
        ],
        '17.0213': [
            '17.0213px',
            {
                lineHeight: '17.0213px'
            }
        ]
    },
    spacing: {
        '10': '20px',
        '15': '30px',
        '20': '40px',
        '22': '44px',
        '28': '56px',
        '31': '62px',
        '43': '86px',
        '47': '94px',
        '98': '196px',
        '100': '200px',
        '1px': '1px',
        '35px': '35px',
        '47px': '47px',
        '69px': '69px',
        '125px': '125px',
        '213px': '213px'
    },
    borderRadius: {
        md: '8px',
        lg: '16px',
        xl: '24px',
        full: '9999px'
    },
    boxShadow: {
        xs: 'rgba(0, 0, 0, 0.05) 0px 1px 1px 0px, rgba(34, 42, 53, 0.04) 0px 4px 6px 0px, rgba(47, 48, 55, 0.05) 0px 24px 68px 0px, rgba(0, 0, 0, 0.04) 0px 2px 3px 0px',
        sm: 'rgba(0, 0, 0, 0.15) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 0px 20px 0px',
        md: 'rgba(0, 0, 0, 0.1) 0px 4px 12px 0px',
        lg: 'rgba(0, 0, 0, 0.15) 0px 4px 20px 0px'
    },
    screens: {
        sm: '480px',
        md: '801px',
        lg: '1024px',
        '1200px': '1200px'
    },
    transitionDuration: {
        '120': '0.12s',
        '150': '0.15s',
        '200': '0.2s',
        '300': '0.3s',
        '500': '0.5s',
        '600': '0.6s',
        '8000': '8s'
    },
    transitionTimingFunction: {
        custom: 'cubic-bezier(0.4, 0, 0.2, 1)',
        default: 'ease',
        linear: 'linear'
    },
    container: {
        center: true,
        padding: '0px'
    },
    maxWidth: {
        container: '1723.37px'
    }
},
  },
};
