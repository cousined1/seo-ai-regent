// React Theme — extracted from https://www.semrush.com/writing-assistant/
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
    heading: string;
 *   };
 *   fontSizes: {
    '12': string;
    '14': string;
    '16': string;
    '22': string;
    '24': string;
    '32': string;
    '40': string;
    '48': string;
    '100': string;
    '13.3333': string;
 *   };
 *   space: {
    '1': string;
    '4': string;
    '16': string;
    '30': string;
    '37': string;
    '44': string;
    '48': string;
    '56': string;
    '68': string;
    '80': string;
    '117': string;
    '187': string;
    '418': string;
 *   };
 *   radii: {
    sm: string;
    md: string;
    full: string;
 *   };
 *   shadows: {

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
    "primary": "#181e15",
    "secondary": "#006dca",
    "accent": "#e0e1e9",
    "background": "#ffffff",
    "foreground": "#000000",
    "neutral50": "#000000",
    "neutral100": "#333333",
    "neutral200": "#ffffff",
    "neutral300": "#3e424b",
    "neutral400": "#898d9a",
    "neutral500": "#6c6e79",
    "neutral600": "#575c66"
  },
  "fonts": {
    "body": "'Arial', sans-serif",
    "heading": "'Factor A', sans-serif"
  },
  "fontSizes": {
    "12": "12px",
    "14": "14px",
    "16": "16px",
    "22": "22px",
    "24": "24px",
    "32": "32px",
    "40": "40px",
    "48": "48px",
    "100": "100px",
    "13.3333": "13.3333px"
  },
  "space": {
    "1": "1px",
    "4": "4px",
    "16": "16px",
    "30": "30px",
    "37": "37px",
    "44": "44px",
    "48": "48px",
    "56": "56px",
    "68": "68px",
    "80": "80px",
    "117": "117px",
    "187": "187px",
    "418": "418px"
  },
  "radii": {
    "sm": "5px",
    "md": "10px",
    "full": "100px"
  },
  "shadows": {},
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
      "main": "#181e15",
      "light": "hsl(100, 18%, 25%)",
      "dark": "hsl(100, 18%, 10%)"
    },
    "secondary": {
      "main": "#006dca",
      "light": "hsl(208, 100%, 55%)",
      "dark": "hsl(208, 100%, 25%)"
    },
    "background": {
      "default": "#ffffff",
      "paper": "#421983"
    },
    "text": {
      "primary": "#000000",
      "secondary": "#333333"
    }
  },
  "typography": {
    "fontFamily": "'Times New Roman', sans-serif",
    "h1": {
      "fontSize": "32px",
      "fontWeight": "700",
      "lineHeight": "38.4px",
      "fontFamily": "'Factor A', sans-serif"
    },
    "h2": {
      "fontSize": "24px",
      "fontWeight": "700",
      "lineHeight": "28px",
      "fontFamily": "'Factor A', sans-serif"
    },
    "h3": {
      "fontSize": "22px",
      "fontWeight": "700",
      "lineHeight": "28.6px",
      "fontFamily": "'Factor A', sans-serif"
    }
  },
  "shape": {
    "borderRadius": 10
  },
  "shadows": []
};

export default theme;
