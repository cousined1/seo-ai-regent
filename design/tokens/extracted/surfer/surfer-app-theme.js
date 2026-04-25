// React Theme — extracted from https://app.surferseo.com
// Compatible with: Chakra UI, Stitches, Vanilla Extract, or any CSS-in-JS

/**
 * TypeScript type definition for this theme:
 *
 * interface Theme {
 *   colors: {
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
    neutral800: string;
    neutral900: string;
 *   };
 *   fonts: {
    body: string;
 *   };
 *   fontSizes: {
    '14': string;
    '16': string;
    '60': string;
    '13.3333': string;
 *   };
 *   space: {
    '1': string;
    '16': string;
    '24': string;
    '32': string;
    '40': string;
    '64': string;
 *   };
 *   radii: {
    xs: string;
    md: string;
    lg: string;
 *   };
 *   shadows: {
    xs: string;
    sm: string;
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
    "background": "#ffffff",
    "foreground": "#000000",
    "neutral50": "#000000",
    "neutral100": "#18181b",
    "neutral200": "#ffffff",
    "neutral300": "#3f3f47",
    "neutral400": "#9f9fa9",
    "neutral500": "#e4e4e7",
    "neutral600": "#71717b",
    "neutral700": "#d4d4d8",
    "neutral800": "#2f2f34",
    "neutral900": "#f4f4f5"
  },
  "fonts": {
    "body": "'Inter', sans-serif"
  },
  "fontSizes": {
    "14": "14px",
    "16": "16px",
    "60": "60px",
    "13.3333": "13.3333px"
  },
  "space": {
    "1": "1px",
    "16": "16px",
    "24": "24px",
    "32": "32px",
    "40": "40px",
    "64": "64px"
  },
  "radii": {
    "xs": "2px",
    "md": "8px",
    "lg": "16px"
  },
  "shadows": {
    "xs": "rgba(26, 29, 40, 0.06) 0px 1px 2px 0px",
    "sm": "rgb(128, 128, 128) 0px 0px 5px 0px"
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
    "background": {
      "default": "#ffffff",
      "paper": "#000000"
    },
    "text": {
      "primary": "#000000",
      "secondary": "#18181b"
    }
  },
  "typography": {
    "h1": {
      "fontSize": "60px",
      "fontWeight": "600",
      "lineHeight": "60px"
    },
    "body1": {
      "fontSize": "16px",
      "fontWeight": "400",
      "lineHeight": "normal"
    },
    "body2": {
      "fontSize": "13.3333px",
      "fontWeight": "400",
      "lineHeight": "normal"
    }
  },
  "shape": {
    "borderRadius": 8
  },
  "shadows": [
    "rgba(26, 29, 40, 0.06) 0px 1px 2px 0px",
    "rgb(128, 128, 128) 0px 0px 5px 0px"
  ]
};

export default theme;
