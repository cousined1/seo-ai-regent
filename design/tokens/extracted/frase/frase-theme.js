// React Theme — extracted from https://frase.io
// Compatible with: Chakra UI, Stitches, Vanilla Extract, or any CSS-in-JS

/**
 * TypeScript type definition for this theme:
 *
 * interface Theme {
 *   colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    neutral50: string;
    neutral100: string;
    neutral200: string;
    neutral300: string;
    neutral400: string;
    neutral500: string;
    neutral600: string;
 *   };
 *   fonts: {
    body: string;
 *   };
 *   fontSizes: {
    '18': string;
    '20': string;
    '22': string;
    '24': string;
    '26': string;
    '28': string;
    '32': string;
    '48': string;
    '70.4': string;
    '44.8': string;
    '35.84': string;
    '16.64': string;
 *   };
 *   space: {
    '2': string;
    '48': string;
    '56': string;
    '64': string;
    '77': string;
    '102': string;
    '128': string;
    '149': string;
    '167': string;
    '176': string;
    '184': string;
    '208': string;
    '247': string;
    '262': string;
    '288': string;
    '298': string;
 *   };
 *   radii: {
    sm: string;
    md: string;
    lg: string;
    full: string;
 *   };
 *   shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
 *   };
 *   states: {
 *     hover: { opacity: number };
 *     focus: { opacity: number };
 *     active: { opacity: number };
 *     disabled: { opacity: number };
 *   };
 * }
 */

export const theme = {
  "colors": {
    "primary": "#e2e8f0",
    "secondary": "#020817",
    "accent": "#28a05f",
    "background": "#ffffff",
    "foreground": "#000000",
    "neutral50": "#ffffff",
    "neutral100": "#78716c",
    "neutral200": "#44403c",
    "neutral300": "#1c1917",
    "neutral400": "#000000",
    "neutral500": "#a8a29e",
    "neutral600": "#57534e"
  },
  "fonts": {
    "body": "'system-ui', sans-serif"
  },
  "fontSizes": {
    "18": "18px",
    "20": "20px",
    "22": "22px",
    "24": "24px",
    "26": "26px",
    "28": "28px",
    "32": "32px",
    "48": "48px",
    "70.4": "70.4px",
    "44.8": "44.8px",
    "35.84": "35.84px",
    "16.64": "16.64px"
  },
  "space": {
    "2": "2px",
    "48": "48px",
    "56": "56px",
    "64": "64px",
    "77": "77px",
    "102": "102px",
    "128": "128px",
    "149": "149px",
    "167": "167px",
    "176": "176px",
    "184": "184px",
    "208": "208px",
    "247": "247px",
    "262": "262px",
    "288": "288px",
    "298": "298px"
  },
  "radii": {
    "sm": "4px",
    "md": "8px",
    "lg": "16px",
    "full": "9999px"
  },
  "shadows": {
    "sm": "rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.03) 0px 1px 2px 0px",
    "md": "rgba(0, 0, 0, 0.15) 0px 4px 12px 0px",
    "lg": "rgba(40, 160, 95, 0.3) 0px 4px 14px 0px",
    "xl": "rgba(0, 0, 0, 0.18) 0px 30px 60px -15px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px"
  },
  "states": {
    "hover": {
      "opacity": 0.08
    },
    "focus": {
      "opacity": 0.12
    },
    "active": {
      "opacity": 0.16
    },
    "disabled": {
      "opacity": 0.38
    }
  }
};

// MUI v5 theme
export const muiTheme = {
  "palette": {
    "primary": {
      "main": "#e2e8f0",
      "light": "hsl(214, 32%, 95%)",
      "dark": "hsl(214, 32%, 76%)"
    },
    "secondary": {
      "main": "#020817",
      "light": "hsl(223, 84%, 20%)",
      "dark": "hsl(223, 84%, 10%)"
    },
    "background": {
      "default": "#ffffff",
      "paper": "#faf8f5"
    },
    "text": {
      "primary": "#000000",
      "secondary": "#020817"
    }
  },
  "typography": {
    "fontFamily": "'Times New Roman', sans-serif",
    "h1": {
      "fontSize": "32px",
      "fontWeight": "600",
      "lineHeight": "36.8px"
    },
    "h2": {
      "fontSize": "28px",
      "fontWeight": "700",
      "lineHeight": "42px"
    }
  },
  "shape": {
    "borderRadius": 8
  },
  "shadows": [
    "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px",
    "rgba(0, 0, 0, 0.06) 0px 1px 3px 0px",
    "rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.03) 0px 1px 2px 0px",
    "rgba(0, 0, 0, 0.08) 0px 4px 12px 0px, rgba(0, 0, 0, 0.04) 0px 2px 4px 0px",
    "rgba(0, 0, 0, 0.15) 0px 4px 12px 0px"
  ]
};

export default theme;
