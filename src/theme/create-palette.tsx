import { alpha, TypeAction } from "@mui/material/styles";
import { common } from "@mui/material/colors";
import { neutral, primary, success, info, warning, error } from "./colors";
import { PaletteOptions } from "@mui/material/styles";

// Define custom palette options
interface CustomPaletteOptions extends PaletteOptions {
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  primary: {
    lightest: string;
    light: string;
    main: string;
    dark: string;
    contrastText: string;
  };
  success: {
    lightest: string;
    light: string;
    main: string;
    dark: string;
    contrastText: string;
  };
  info: {
    lightest: string;
    light: string;
    main: string;
    dark: string;
    contrastText: string;
  };
  warning: {
    lightest: string;
    light: string;
    main: string;
    dark: string;
    contrastText: string;
  };
  error: {
    lightest: string;
    light: string;
    main: string;
    dark: string;
    contrastText: string;
  };
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}

// Define custom action type
interface CustomTypeAction extends TypeAction {}

export function createPalette(): CustomPaletteOptions {
  return {
    action: {
      active: neutral[500],
      disabled: alpha(neutral[900], 0.38),
      disabledBackground: alpha(neutral[900], 0.12),
      focus: alpha(neutral[900], 0.16),
      hover: alpha(neutral[900], 0.04),
      selected: alpha(neutral[900], 0.12),
    } as CustomTypeAction,
    background: {
      default: neutral[100],
      paper: common.white,
    },
    divider: "#F2F4F7",
    mode: "light",
    primary: {
      lightest: primary.lightest,
      light: primary.light,
      main: primary.main,
      dark: primary.dark,
      contrastText: primary.contrastText,
    },
    success: {
      lightest: success.lightest,
      light: success.light,
      main: success.main,
      dark: success.dark,
      contrastText: success.contrastText,
    },
    info: {
      lightest: info.lightest,
      light: info.light,
      main: info.main,
      dark: info.dark,
      contrastText: info.contrastText,
    },
    warning: {
      lightest: warning.lightest,
      light: warning.light,
      main: warning.main,
      dark: warning.dark,
      contrastText: warning.contrastText,
    },
    error: {
      lightest: error.lightest,
      light: error.light,
      main: error.main,
      dark: error.dark,
      contrastText: error.contrastText,
    },
    text: {
      primary: neutral[900],
      secondary: neutral[500],
      disabled: alpha(neutral[900], 0.38),
    },
    neutral: {
      50: neutral[50],
      100: neutral[100],
      200: neutral[200],
      300: neutral[300],
      400: neutral[400],
      500: neutral[500],
      600: neutral[600],
      700: neutral[700],
      800: neutral[800],
      900: neutral[900],
    },
  };
}
