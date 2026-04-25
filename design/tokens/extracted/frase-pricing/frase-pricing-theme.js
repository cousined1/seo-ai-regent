// React Theme — extracted from https://www.frase.io/pricing
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
    neutral700: string;
 *   };
 *   fonts: {
    body: string;
 *   };
 *   fontSizes: {
    '15': string;
    '16': string;
    '17': string;
    '18': string;
    '22': string;
    '26': string;
    '28': string;
    '42': string;
    '64': string;
    '44.8': string;
    '38.4': string;
    '15.36': string;
 *   };
 *   space: {
    '1': string;
    '48': string;
    '56': string;
    '64': string;
    '72': string;
    '77': string;
    '102': string;
    '108': string;
    '208': string;
    '258': string;
    '268': string;
    '278': string;
    '288': string;
    '328': string;
    '471': string;
 *   };
 *   radii: {
    md: string;
    lg: string;
    xl: string;
    full: string;
 *   };
 *   shadows: {
    sm: string;
    md: string;
    lg: string;
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
    "neutral50": "#44403c",
    "neutral100": "#ffffff",
    "neutral200": "#78716c",
    "neutral300": "#000000",
    "neutral400": "#57534e",
    "neutral500": "#1c1917",
    "neutral600": "#d6d3d1",
    "neutral700": "#a8a29e"
  },
  "fonts": {
    "body": "'system-ui', sans-serif"
  },
  "fontSizes": {
    "15": "15px",
    "16": "16px",
    "17": "17px",
    "18": "18px",
    "22": "22px",
    "26": "26px",
    "28": "28px",
    "42": "42px",
    "64": "64px",
    "44.8": "44.8px",
    "38.4": "38.4px",
    "15.36": "15.36px"
  },
  "space": {
    "1": "1px",
    "48": "48px",
    "56": "56px",
    "64": "64px",
    "72": "72px",
    "77": "77px",
    "102": "102px",
    "108": "108px",
    "208": "208px",
    "258": "258px",
    "268": "268px",
    "278": "278px",
    "288": "288px",
    "328": "328px",
    "471": "471px"
  },
  "radii": {
    "md": "8px",
    "lg": "16px",
    "xl": "24px",
    "full": "9999px"
  },
  "shadows": {
    "sm": "rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.03) 0px 1px 2px 0px",
    "md": "rgba(0, 0, 0, 0.15) 0px 4px 12px 0px",
    "lg": "rgba(40, 160, 95, 0.12) 0px 4px 20px 0px, rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.03) 0px 1px 2px 0px"
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
      "fontSize": "38.4px",
      "fontWeight": "600",
      "lineHeight": "57.6px"
    },
    "h2": {
      "fontSize": "26px",
      "fontWeight": "700",
      "lineHeight": "39px"
    }
  },
  "shape": {
    "borderRadius": 8
  },
  "shadows": [
    "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px",
    "rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.03) 0px 1px 2px 0px",
    "rgba(40, 160, 95, 0.25) 0px 2px 8px 0px",
    "rgba(0, 0, 0, 0.2) 0px 4px 12px 0px",
    "rgba(0, 0, 0, 0.15) 0px 4px 12px 0px"
  ]
};

export default theme;
