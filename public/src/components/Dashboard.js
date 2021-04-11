//https://stackoverflow.com/questions/59145165/change-root-background-color-with-material-ui-theme

import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import { Paper, Button, TextField } from "@material-ui/core";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import PersistentDrawerLeft from "./Nav";
import theme from "../theme";
import Stories from "./Stories";
import "../App.css";

function App() {
    const classes = useStyles();
    const [currentDisplaySprint, setCurrentDisplaySprint] = useState(-1);
    const [currentDisplayProj, setCurrentDisplayProj] = useState(-1);

    const PopulateMainDisplay = (sprintData) => {
        console.log("dashboard-populatedisplayfunc-sprintdata" + sprintData);
        //don't update the sprint component if they click the one already open
        if (sprintData != currentDisplaySprint) {
            setCurrentDisplaySprint({ sprintId: sprintData });
        }
    };

    const ProjectOnMainDisplay = (projData) => {
        let currentid = projData.id;
        if (currentid != currentDisplayProj.projid) {
            console.log("updating current proj");
            setCurrentDisplayProj({
                projid: projData.id,
                productname: projData.productname,
                teamname: projData.teamname,
                projectstartdate: projData.hoursperstorypoint,
                hoursperstorypoint: projData.hoursperstorypoint,
                totalestimatedstorypoints: projData.totalestimatedstorypoints,
                totalestimatedcost: projData.totalestimatedcost,
            });
        }
    };

    const greeting = `
    Welcome to SprintCompass!
    Choose an option from the sidebar
    `;


    
    return (
        <MuiThemeProvider theme={theme}>
            <div className="App">
                <header className="App-header">
                    <PersistentDrawerLeft
                        sendToMainDisplay={PopulateMainDisplay}
                        projDisplayMain={ProjectOnMainDisplay}
                    />
                    <div className="headSeparator" />
                    <Paper
                        className="mainPaper"
                        color="secondary"
                        elevation={3}
                    >
                        <h2>Team Infinity</h2>
                        {currentDisplayProj == -1 && (
                            <h3 style={{ padding: 20, whiteSpace: "pre-wrap" }}>
                                {greeting}
                            </h3>
                        )}
                        {currentDisplayProj != -1 && (
                            <div style={{ width: '90%' }}>
                                <Box overflow="hidden" style={{backgroundColor: '#669999', padding: '10%', margin: '10%' }}>
                                    <h4 style={{ margin: 0, textAlign: 'left', paddingLeft: '15%' }}>Team: {currentDisplayProj.teamname}</h4>
                                    <h4 style={{ margin: 0, textAlign: 'left', paddingLeft: '15%' }}>Project: {currentDisplayProj.productname}</h4>
                                    <h6 style={{ margin: 0, textAlign: 'left', paddingLeft: '15%' }}>Start Date: {currentDisplayProj.projectstartdate}</h6>
                                    <h6 style={{ margin: 0, textAlign: 'left', paddingLeft: '15%' }}>Hours Per Storypoint: {currentDisplayProj.hoursperstorypoint}</h6>
                                    <h6 style={{ margin: 0, textAlign: 'left', paddingLeft: '15%' }}>Total Estimated Storypoints: {currentDisplayProj.totalestimatedstorypoints}</h6>
                                    <h6 style={{ margin: 0, textAlign: 'left', paddingLeft: '15%' }}>Total Estimated Cost: {currentDisplayProj.totalestimatedcost}</h6>
                                    <br/>
                                    {currentDisplaySprint != -1 && (
                                        <Box>
                                            {() => (
                                                <Stories
                                                    parentsprint={currentDisplaySprint}
                                                    parentproj={currentDisplayProj}
                                                ></Stories>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            </div>
                        )}
                    </Paper>
                </header>
            </div>
        </MuiThemeProvider>
    );
}

export default App;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        "& > *": {
            margin: theme.spacing(1),
            width: theme.spacing(16),
            height: theme.spacing(16),
        },
    },
}));
