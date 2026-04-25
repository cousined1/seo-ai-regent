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
            DEFAULT: '#783afb'
        },
        'neutral-50': '#000000',
        'neutral-100': '#ffffff',
        'neutral-200': '#f4f4f5',
        'neutral-300': '#d4d4d8',
        'neutral-400': '#999999',
        'neutral-500': '#e4e4e7',
        'neutral-600': '#2f2f34',
        'neutral-700': '#444444',
        'neutral-800': '#18181b',
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
        '14': [
            '14px',
            {
                lineHeight: '20px'
            }
        ],
        '15': [
            '15px',
            {
                lineHeight: '15px'
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
                lineHeight: '60px'
            }
        ],
        '20': [
            '20px',
            {
                lineHeight: '20px'
            }
        ],
        '41.2826': [
            '41.2826px',
            {
                lineHeight: '49.5391px'
            }
        ],
        '33.5274': [
            '33.5274px',
            {
                lineHeight: '40.2329px'
            }
        ],
        '27.2998': [
            '27.2998px',
            {
                lineHeight: '34.1247px'
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
                lineHeight: '24.4797px'
            }
        ],
        '18.0171': [
            '18.0171px',
            {
                lineHeight: '27.0256px'
            }
        ],
        '17.2337': [
            '17.2337px',
            {
                lineHeight: '21.5421px'
            }
        ],
        '17.0213': [
            '17.0213px',
            {
                lineHeight: '20.4255px'
            }
        ],
        '15.667': [
            '15.667px',
            {
                lineHeight: 'normal'
            }
        ]
    },
    spacing: {
        '0': '1px',
        '1': '15px',
        '2': '20px',
        '3': '24px',
        '4': '30px',
        '5': '35px',
        '6': '37px',
        '7': '39px',
        '8': '44px',
        '9': '47px',
        '10': '62px',
        '11': '69px',
        '12': '94px',
        '13': '96px',
        '14': '114px',
        '15': '123px',
        '16': '136px',
        '17': '213px'
    },
    borderRadius: {
        xs: '1px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '20px',
        full: '9999px'
    },
    boxShadow: {
        xs: 'rgb(136, 136, 136) 0px 0px 1px 0px',
        sm: 'rgba(0, 0, 0, 0.2) 1px 1px 4px 0px',
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
        '100': '0.1s',
        '120': '0.12s',
        '150': '0.15s',
        '200': '0.2s',
        '280': '0.28s',
        '300': '0.3s',
        '500': '0.5s'
    },
    transitionTimingFunction: {
        custom: 'cubic-bezier(0.4, 0, 0.2, 1)',
        default: 'ease'
    },
    container: {
        center: true,
        padding: '0px'
    },
    maxWidth: {
        container: '1253.36px'
    }
},
  },
};
