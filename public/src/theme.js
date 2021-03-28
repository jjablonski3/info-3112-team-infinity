import { createMuiTheme } from "@material-ui/core/styles";
export default createMuiTheme({
    typography: {
        useNextVariants: true
    },
    palette: {
        common: { black: "#000", white: "#fff" },
        background: { paper: "#fff", default: "#fafafa" },
        primary: {
            light: "rgba(189, 195, 199, 1)",
            main: "rgba(52, 73, 94, 1)",
            dark: "rgba(44, 62, 80, 1)",
            contrastText: "#fff"
        },
        secondary: {
            light: "rgba(149, 165, 166, 1)",
            main: "rgba(44, 62, 80, 1)",
            dark: "rgba(44, 62, 80, 1)",
            contrastText: "#fff"
        },
        error: {
            light: "#e57373",
            main: "#f44336",
            dark: "#d32f2f",
            contrastText: "#fff"
        },
        text: {
            primary: "rgba(0, 0, 0, 0.87)",
            secondary: "rgba(0, 0, 0, 0.54)",
            disabled: "rgba(0, 0, 0, 0.38)",
            hint: "rgba(0, 0, 0, 0.38)"
        }
    }
});
