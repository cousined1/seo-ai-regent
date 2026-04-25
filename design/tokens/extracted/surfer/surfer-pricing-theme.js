// React Theme — extracted from https://surferseo.com/pricing/
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
    neutral800: string;
    neutral900: string;
 *   };
 *   fonts: {
    body: string;
 *   };
 *   fontSizes: {
    '16': string;
    '18': string;
    '20': string;
    '41.2826': string;
    '33.5274': string;
    '27.2998': string;
    '22.3647': string;
    '22.2472': string;
    '19.5838': string;
    '18.0171': string;
    '17.2337': string;
    '17.0213': string;
 *   };
 *   space: {
    '1': string;
    '15': string;
    '20': string;
    '24': string;
    '30': string;
    '35': string;
    '37': string;
    '39': string;
    '44': string;
    '47': string;
    '62': string;
    '69': string;
    '94': string;
    '96': string;
    '114': string;
    '123': string;
 *   };
 *   radii: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
 *   };
 *   shadows: {
    xs: string;
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
    "primary": "#ff5b49",
    "secondary": "#783afb",
    "accent": "#783afb",
    "background": "#000000",
    "foreground": "#000000",
    "neutral50": "#000000",
    "neutral100": "#ffffff",
    "neutral200": "#f4f4f5",
    "neutral300": "#d4d4d8",
    "neutral400": "#999999",
    "neutral500": "#e4e4e7",
    "neutral600": "#2f2f34",
    "neutral700": "#444444",
    "neutral800": "#18181b",
    "neutral900": "#666666"
  },
  "fonts": {
    "body": "'sans-serif', sans-serif"
  },
  "fontSizes": {
    "16": "16px",
    "18": "18px",
    "20": "20px",
    "41.2826": "41.2826px",
    "33.5274": "33.5274px",
    "27.2998": "27.2998px",
    "22.3647": "22.3647px",
    "22.2472": "22.2472px",
    "19.5838": "19.5838px",
    "18.0171": "18.0171px",
    "17.2337": "17.2337px",
    "17.0213": "17.0213px"
  },
  "space": {
    "1": "1px",
    "15": "15px",
    "20": "20px",
    "24": "24px",
    "30": "30px",
    "35": "35px",
    "37": "37px",
    "39": "39px",
    "44": "44px",
    "47": "47px",
    "62": "62px",
    "69": "69px",
    "94": "94px",
    "96": "96px",
    "114": "114px",
    "123": "123px"
  },
  "radii": {
    "xs": "1px",
    "sm": "4px",
    "md": "8px",
    "lg": "16px",
    "xl": "20px",
    "full": "9999px"
  },
  "shadows": {
    "xs": "rgb(136, 136, 136) 0px 0px 1px 0px",
    "sm": "rgba(0, 0, 0, 0.2) 1px 1px 4px 0px",
    "md": "rgba(0, 0, 0, 0.1) 0px 4px 12px 0px",
    "lg": "rgba(0, 0, 0, 0.15) 0px 4px 20px 0px"
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
      "main": "#ff5b49",
      "light": "hsl(6, 100%, 79%)",
      "dark": "hsl(6, 100%, 49%)"
    },
    "secondary": {
      "main": "#783afb",
      "light": "hsl(259, 96%, 76%)",
      "dark": "hsl(259, 96%, 46%)"
    },
    "background": {
      "default": "#000000",
      "paper": "#ffffff"
    },
    "text": {
      "primary": "#000000",
      "secondary": "#ffffff"
    }
  },
  "typography": {
    "fontFamily": "'system-ui', sans-serif",
    "h1": {
      "fontSize": "33.5274px",
      "fontWeight": "600",
      "lineHeight": "40.2329px"
    },
    "h2": {
      "fontSize": "27.2998px",
      "fontWeight": "600",
      "lineHeight": "34.1247px"
    },
    "h3": {
      "fontSize": "20px",
      "fontWeight": "400",
      "lineHeight": "20px"
    }
  },
  "shape": {
    "borderRadius": 8
  },
  "shadows": [
    "rgba(0, 0, 0, 0.2) 0px -1px 0px 0px inset, rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset",
    "rgb(136, 136, 136) 0px 0px 1px 0px",
    "rgba(0, 0, 0, 0.15) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 0px 20px 0px",
    "rgba(0, 0, 0, 0.2) 1px 1px 4px 0px",
    "rgba(0, 0, 0, 0.12) 0px 0px 10px 0px"
  ]
};

export default theme;
