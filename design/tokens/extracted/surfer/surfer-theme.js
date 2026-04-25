// React Theme — extracted from https://surferseo.com
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
    '18': string;
    '20': string;
    '78.3351': string;
    '62.8639': string;
    '41.2826': string;
    '39.1675': string;
    '31.334': string;
    '23.5005': string;
    '22.3647': string;
    '22.2472': string;
    '19.5838': string;
    '18.3937': string;
 *   };
 *   space: {
    '1': string;
    '20': string;
    '30': string;
    '35': string;
    '40': string;
    '44': string;
    '47': string;
    '56': string;
    '62': string;
    '69': string;
    '86': string;
    '94': string;
    '125': string;
    '196': string;
    '200': string;
    '213': string;
 *   };
 *   radii: {
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
    "accent": "#ff5b49",
    "background": "#000000",
    "foreground": "#000000",
    "neutral50": "#ffffff",
    "neutral100": "#000000",
    "neutral200": "#f4f4f5",
    "neutral300": "#dddddd",
    "neutral400": "#2f2f34",
    "neutral500": "#18181b",
    "neutral600": "#444444",
    "neutral700": "#09090b",
    "neutral800": "#999999",
    "neutral900": "#666666"
  },
  "fonts": {
    "body": "'sans-serif', sans-serif"
  },
  "fontSizes": {
    "18": "18px",
    "20": "20px",
    "78.3351": "78.3351px",
    "62.8639": "62.8639px",
    "41.2826": "41.2826px",
    "39.1675": "39.1675px",
    "31.334": "31.334px",
    "23.5005": "23.5005px",
    "22.3647": "22.3647px",
    "22.2472": "22.2472px",
    "19.5838": "19.5838px",
    "18.3937": "18.3937px"
  },
  "space": {
    "1": "1px",
    "20": "20px",
    "30": "30px",
    "35": "35px",
    "40": "40px",
    "44": "44px",
    "47": "47px",
    "56": "56px",
    "62": "62px",
    "69": "69px",
    "86": "86px",
    "94": "94px",
    "125": "125px",
    "196": "196px",
    "200": "200px",
    "213": "213px"
  },
  "radii": {
    "md": "8px",
    "lg": "16px",
    "xl": "24px",
    "full": "9999px"
  },
  "shadows": {
    "xs": "rgba(0, 0, 0, 0.05) 0px 1px 1px 0px, rgba(34, 42, 53, 0.04) 0px 4px 6px 0px, rgba(47, 48, 55, 0.05) 0px 24px 68px 0px, rgba(0, 0, 0, 0.04) 0px 2px 3px 0px",
    "sm": "rgba(0, 0, 0, 0.15) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 0px 20px 0px",
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
      "fontSize": "39.1675px",
      "fontWeight": "600",
      "lineHeight": "47.001px"
    },
    "h2": {
      "fontSize": "31.334px",
      "fontWeight": "600",
      "lineHeight": "47.001px"
    },
    "h3": {
      "fontSize": "23.5005px",
      "fontWeight": "600",
      "lineHeight": "30.5507px"
    }
  },
  "shape": {
    "borderRadius": 8
  },
  "shadows": [
    "rgba(0, 0, 0, 0.2) 0px -1px 0px 0px inset, rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset",
    "rgba(0, 0, 0, 0.05) 0px 1px 1px 0px, rgba(34, 42, 53, 0.04) 0px 4px 6px 0px, rgba(47, 48, 55, 0.05) 0px 24px 68px 0px, rgba(0, 0, 0, 0.04) 0px 2px 3px 0px",
    "rgba(0, 0, 0, 0.15) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 0px 20px 0px",
    "rgba(0, 0, 0, 0.12) 0px 0px 10px 0px",
    "rgba(0, 0, 0, 0.1) 0px 4px 12px 0px"
  ]
};

export default theme;
