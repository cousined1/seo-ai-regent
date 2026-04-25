// React Theme — extracted from https://www.clearscope.io/pricing
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
 *   };
 *   fonts: {
    mono: string;
    body: string;
 *   };
 *   fontSizes: {
    '12': string;
    '14': string;
    '16': string;
    '18': string;
    '74.2362': string;
    '62.0374': string;
    '43.3472': string;
    '21.217': string;
    '17.7565': string;
    '14.865': string;
    '12.447': string;
 *   };
 *   space: {
    '2': string;
    '15': string;
    '22': string;
    '32': string;
    '38': string;
    '54': string;
    '63': string;
    '78': string;
    '116': string;
    '156': string;
 *   };
 *   radii: {
    xs: string;
    md: string;
 *   };
 *   shadows: {
    sm: string;
    xs: string;
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
    "primary": "#580101",
    "secondary": "#e0e9f2",
    "accent": "#ffc2c2",
    "background": "#f4f4f2",
    "foreground": "#000000",
    "neutral50": "#000000",
    "neutral100": "#f4f4f2",
    "neutral200": "#c1c1c1"
  },
  "fonts": {
    "mono": "'GT-Pressura-Mono', monospace",
    "body": "'ui-sans-serif', sans-serif"
  },
  "fontSizes": {
    "12": "12px",
    "14": "14px",
    "16": "16px",
    "18": "18px",
    "74.2362": "74.2362px",
    "62.0374": "62.0374px",
    "43.3472": "43.3472px",
    "21.217": "21.217px",
    "17.7565": "17.7565px",
    "14.865": "14.865px",
    "12.447": "12.447px"
  },
  "space": {
    "2": "2px",
    "15": "15px",
    "22": "22px",
    "32": "32px",
    "38": "38px",
    "54": "54px",
    "63": "63px",
    "78": "78px",
    "116": "116px",
    "156": "156px"
  },
  "radii": {
    "xs": "2px",
    "md": "6px"
  },
  "shadows": {
    "sm": "rgb(128, 128, 128) 0px 0px 5px 0px",
    "xs": "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px"
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
      "main": "#580101",
      "light": "hsl(0, 98%, 32%)",
      "dark": "hsl(0, 98%, 10%)"
    },
    "secondary": {
      "main": "#e0e9f2",
      "light": "hsl(210, 41%, 95%)",
      "dark": "hsl(210, 41%, 76%)"
    },
    "background": {
      "default": "#f4f4f2",
      "paper": "#010101"
    },
    "text": {
      "primary": "#000000",
      "secondary": "#010101"
    }
  },
  "typography": {
    "fontFamily": "'ui-sans-serif', sans-serif",
    "h1": {
      "fontSize": "43.3472px",
      "fontWeight": "600",
      "lineHeight": "65.0208px"
    },
    "h3": {
      "fontSize": "21.217px",
      "fontWeight": "400",
      "lineHeight": "31.8254px"
    },
    "body1": {
      "fontSize": "17.7565px",
      "fontWeight": "400",
      "lineHeight": "17.7565px"
    }
  },
  "shape": {
    "borderRadius": 6
  },
  "shadows": [
    "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px",
    "rgba(0, 0, 0, 0) 0px 0px 0px 0px",
    "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px",
    "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
    "rgb(128, 128, 128) 0px 0px 5px 0px"
  ]
};

export default theme;
