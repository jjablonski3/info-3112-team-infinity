//https://stackoverflow.com/questions/59145165/change-root-background-color-with-material-ui-theme

import React from "react";
import { Paper, Button } from "@material-ui/core";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import Nav from "./Nav";
import Card from "./Card";
import theme from "../theme";
import Sprint from "./Sprint";
import "../App.css";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        "& > *": {
            margin: theme.spacing(1),
            width: theme.spacing(16),
            height: theme.spacing(16)
        }
    }
}));

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
    const classes = useStyles();

    //const [light, setLight] = React.useState(true);

    const ProjSprints = ({sprints}) => (
        <>
          {sprints.map(sprint => (
            <Sprint props={sprint} key={sprints.key}></Sprint>
          ))}
        </>
    ); 

    var sprintList = [
        {name:'sprint1',key:'01'},
        {name:'sprint2',key:'02'}
    ];


    return (
        <MuiThemeProvider theme={theme}>
            <div className="App">
                <header className="App-header">
                    <Nav />
                    <div className="headSeparator" />
                    <Paper
                        className="mainPaper"
                        color="secondary"
                        elevation={3}
                    >
                        <h2>Team Infinity</h2>
                        <ProjSprints sprints={sprintList} />
                    </Paper>
                </header>
            </div>
        </MuiThemeProvider>
    );
}

export default App;
