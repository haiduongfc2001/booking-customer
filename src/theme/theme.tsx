"use client";
import { createTheme } from "@mui/material/styles";
import { ThemeOptions as ThemeOptionsOld } from "@mui/material/styles/createTheme";
import {
  error,
  primary,
  info,
  loading,
  neutral,
  success,
  warning,
} from "./colors";
import { createPalette } from "./create-palette";
import {
  filledInputClasses,
  inputLabelClasses,
  outlinedInputClasses,
  paperClasses,
  tableCellClasses,
} from "@mui/material";
import { createTypography } from "./create-typography";
import { fontStyle } from "@mui/system";

// Custom theme: Colors
const themeColors = {
  neutral,
  primary,
  success,
  info,
  warning,
  error,
  loading,
} as const;

// Create palette
const palette = createPalette();

// Used only to create transitions
const muiTheme = createTheme();

// Override style Mui
const themeOptions: ThemeOptionsOld = {
  ...themeColors,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1440,
    },
  },
  shadows: [
    "none",
    "0px 1px 2px rgba(0, 0, 0, 0.08)",
    "0px 1px 5px rgba(0, 0, 0, 0.08)",
    "0px 1px 8px rgba(0, 0, 0, 0.08)",
    "0px 1px 10px rgba(0, 0, 0, 0.08)",
    "0px 1px 14px rgba(0, 0, 0, 0.08)",
    "0px 1px 18px rgba(0, 0, 0, 0.08)",
    "0px 2px 16px rgba(0, 0, 0, 0.08)",
    "0px 3px 14px rgba(0, 0, 0, 0.08)",
    "0px 3px 16px rgba(0, 0, 0, 0.08)",
    "0px 4px 18px rgba(0, 0, 0, 0.08)",
    "0px 4px 20px rgba(0, 0, 0, 0.08)",
    "0px 5px 22px rgba(0, 0, 0, 0.08)",
    "0px 5px 24px rgba(0, 0, 0, 0.08)",
    "0px 5px 26px rgba(0, 0, 0, 0.08)",
    "0px 6px 28px rgba(0, 0, 0, 0.08)",
    "0px 6px 30px rgba(0, 0, 0, 0.08)",
    "0px 6px 32px rgba(0, 0, 0, 0.08)",
    "0px 7px 34px rgba(0, 0, 0, 0.08)",
    "0px 7px 36px rgba(0, 0, 0, 0.08)",
    "0px 8px 38px rgba(0, 0, 0, 0.08)",
    "0px 8px 40px rgba(0, 0, 0, 0.08)",
    "0px 8px 42px rgba(0, 0, 0, 0.08)",
    "0px 9px 44px rgba(0, 0, 0, 0.08)",
    "0px 9px 46px rgba(0, 0, 0, 0.08)",
  ],
  shape: {
    borderRadius: 8,
  },
  palette: palette,
  typography: createTypography(),
  components: {
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
        },
        sizeSmall: {
          padding: "6px 16px",
        },
        sizeMedium: {
          padding: "8px 20px",
        },
        sizeLarge: {
          padding: "11px 24px",
        },
        textSizeSmall: {
          padding: "7px 12px",
        },
        textSizeMedium: {
          padding: "9px 16px",
        },
        textSizeLarge: {
          padding: "12px 16px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          [`&.${paperClasses.elevation1}`]: {
            boxShadow:
              "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "32px 24px",
          "&:last-child": {
            paddingBottom: "32px",
          },
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: "h6",
        },
        subheaderTypographyProps: {
          variant: "body2",
        },
      },
      styleOverrides: {
        root: {
          padding: "32px 24px 16px",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        html: {
          MozOsxFontSmoothing: "grayscale",
          WebkitFontSmoothing: "antialiased",
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
          width: "100%",
        },
        body: {
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          minHeight: "100%",
          width: "100%",
        },
        "#__next": {
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          height: "100%",
          width: "100%",
        },
        "#nprogress": {
          pointerEvents: "none",
        },
        "#nprogress .bar": {
          backgroundColor: themeColors.primary?.main,
          height: 3,
          left: 0,
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 2000,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&::placeholder": {
            opacity: 1,
            color: "#9DA4AE",
            fontStyle: "italic",
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        input: {
          fontSize: 14,
          fontWeight: 500,
          lineHeight: "24px",
          "&::placeholder": {
            color: palette?.text?.secondary,
          },
        },
      },
    },

    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          borderRadius: 8,
          borderStyle: "solid",
          borderWidth: 1,
          overflow: "hidden",
          borderColor: palette?.neutral[200],
          transition: muiTheme?.transitions.create([
            "border-color",
            "box-shadow",
          ]),
          "&:hover": {
            backgroundColor: palette?.action?.hover,
          },
          "&:before": {
            display: "none",
          },
          "&:after": {
            display: "none",
          },
          [`&.${filledInputClasses.disabled}`]: {
            backgroundColor: "transparent",
          },
          [`&.${filledInputClasses.focused}`]: {
            backgroundColor: "transparent",
            borderColor: palette?.primary?.main,
            boxShadow: `${palette?.primary?.main} 0 0 0 2px`,
          },
          [`&.${filledInputClasses.error}`]: {
            borderColor: palette?.error?.main,
            boxShadow: `${palette?.error?.main} 0 0 0 2px`,
          },
        },
        input: {
          fontSize: 14,
          fontWeight: 500,
          lineHeight: "24px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: palette?.action?.hover,
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: palette?.neutral[200],
            },
          },
          [`&.${outlinedInputClasses.focused}`]: {
            backgroundColor: "transparent",
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: palette?.primary?.main,
              boxShadow: `${palette?.primary?.main} 0 0 0 2px`,
            },
          },
          [`&.${filledInputClasses.error}`]: {
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: palette?.error?.main,
              boxShadow: `${palette?.error?.main} 0 0 0 2px`,
            },
          },
        },
        input: {
          fontSize: 14,
          fontWeight: 500,
          lineHeight: "24px",
        },
        notchedOutline: {
          borderColor: palette?.neutral[200],
          transition: muiTheme?.transitions.create([
            "border-color",
            "box-shadow",
          ]),
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 500,
          [`&.${inputLabelClasses.filled}`]: {
            transform: "translate(12px, 18px) scale(1)",
          },
          [`&.${inputLabelClasses.shrink}`]: {
            [`&.${inputLabelClasses.standard}`]: {
              transform: "translate(0, -1.5px) scale(0.85)",
            },
            [`&.${inputLabelClasses.filled}`]: {
              transform: "translate(12px, 6px) scale(0.85)",
            },
            [`&.${inputLabelClasses.outlined}`]: {
              transform: "translate(14px, -9px) scale(0.85)",
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 500,
          lineHeight: 1.71,
          minWidth: "auto",
          paddingLeft: 0,
          paddingRight: 0,
          textTransform: "none",
          "& + &": {
            marginLeft: 24,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: palette?.divider,
          padding: "15px 16px",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          borderBottom: "none",
          [`& .${tableCellClasses.root}`]: {
            borderBottom: "none",
            backgroundColor: palette?.neutral[50],
            color: palette?.neutral[700],
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          },
          [`& .${tableCellClasses.paddingCheckbox}`]: {
            paddingTop: 4,
            paddingBottom: 4,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "filled",
      },
    },
  },
};

// Update for Typescript
type CustomTheme = {
  [Key in keyof typeof themeColors]: (typeof themeColors)[Key];
};
declare module "@mui/material/styles/createTheme" {
  interface Theme extends CustomTheme {}
  interface ThemeOptions extends CustomTheme {}
}

// Create theme
export const theme = createTheme({ ...themeColors, ...themeOptions });
