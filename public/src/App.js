//https://stackoverflow.com/questions/59145165/change-root-background-color-with-material-ui-theme

import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import theme from "./theme";
import "./App.css";

//Importing custom Components.
import Dashboard from "./components/Dashboard";

/*const themeLight = createMuiTheme({
    palette: {
        background: {
            default: "#0063B2"
        },
        text: {
            default: "#000",
            primary: "#9CC3D5"
        }
    }
});

const themeDark = createMuiTheme({
    palette: {
        background: {
            default: "#222222"
        },
        text: {
            default: "red",
            primary: "#ffffff"
        }
    }
});
*/

function App() {
    return <Dashboard></Dashboard>;
}

export default App;
