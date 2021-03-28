import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import { OutlinedInput, InputAdornment } from "@material-ui/core";

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2)
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
});

const DialogTitle = withStyles(styles)(props => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2)
    }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1)
    }
}))(MuiDialogActions);

const PopupModal = props => {
    //const [open, setOpen] = React.useState(Boolean(props.open));

    const [teamName, setTeamName] = React.useState("");
    const [projectName, setProjectName] = React.useState("");
    const [hoursPerPoint, setHoursPerPoint] = React.useState(0);
    const [totalEstPoints, setTotalEstPoints] = React.useState(0);
    const [totalEstCost, setTotalEstCost] = React.useState(0);

    const handleClearForm = ev => {
        setTeamName("");
        setProjectName("");
        setHoursPerPoint(0);
        setTotalEstPoints(0);
        setTotalEstCost(0);
    };

    const handleTxtFieldInput = ev => {
        console.log(ev.target.id);
        switch (ev.target.id) {
            case "team-name-field":
                setTeamName(ev.target.value);
                break;
            case "project-name-field":
                setProjectName(ev.target.value);
                break;
            case "hours-story-points-field":
                setHoursPerPoint(parseFloat(ev.target.value));
                break;
            case "total-est-points-field":
                setTotalEstPoints(parseFloat(ev.target.value));
                break;
            case "total-est-cost-field":
                setTotalEstCost(parseFloat(ev.target.value));
                break;
        }
        //console.log(teamName);
    };

    const addNewProject = async () => {
        const data = {
            teamname: teamName,
            product: projectName,
            story_hours: hoursPerPoint,
            estimated_storypoints: totalEstPoints,
            estimated_cost: totalEstCost
        };

        try {
            const response = await fetch(
                "http://localhost:5000/api/projectinformation",
                {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(data)
                }
            );

            const output = await response.json();
            alert(`Inserted ${output.results.rowCount} Project Successfully!`);
            handleClearForm();
            props.closeModal();
        } catch (err) {
            alert("failed to process the request: " + err.toString());
            console.log(err);
        }
    };

    return (
        <div>
            <Dialog
                onClose={() => {
                    props.closeModal();
                }}
                aria-labelledby="customized-dialog-title"
                open={props.openModal}
            >
                <DialogTitle
                    id="customized-dialog-title"
                    onClose={() => {
                        props.closeModal();
                    }}
                >
                    Add New Project
                </DialogTitle>
                <DialogContent dividers>
                    {/*<Typography gutterBottom>
                        Cras mattis consectetur purus sit amet fermentum. Cras
                        justo odio, dapibus ac facilisis in, egestas eget quam.
                        Morbi leo risus, porta ac consectetur ac, vestibulum at
                        eros.
                    </Typography>
                    <Typography gutterBottom>
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Vivamus sagittis lacus vel augue laoreet
                        rutrum faucibus dolor auctor.
                    </Typography>
                    <Typography gutterBottom>
                        Aenean lacinia bibendum nulla sed consectetur. Praesent
                        commodo cursus magna, vel scelerisque nisl consectetur
                        et. Donec sed odio dui. Donec ullamcorper nulla non
                        metus auctor fringilla.
                    </Typography>*/}
                    <form id="newProjectForm" noValidate autoComplete="off">
                        <TextField
                            id="team-name-field"
                            label="Team Name"
                            variant="outlined"
                            onChange={handleTxtFieldInput}
                            value={teamName}
                        />
                        <TextField
                            id="project-name-field"
                            label="Project Name"
                            variant="outlined"
                            onChange={handleTxtFieldInput}
                            value={projectName}
                        />
                        <TextField
                            type="number"
                            id="hours-story-points-field"
                            label="Hours per Story Point"
                            variant="outlined"
                            onChange={handleTxtFieldInput}
                            value={hoursPerPoint}
                        />
                        <TextField
                            type="number"
                            id="total-est-points-field"
                            label="Total Estimated Story Points"
                            variant="outlined"
                            onChange={handleTxtFieldInput}
                            value={totalEstPoints}
                        />
                        <TextField
                            type="number"
                            id="total-est-cost-field"
                            label="Project Cost"
                            variant="outlined"
                            onChange={handleTxtFieldInput}
                            value={totalEstCost}
                        />
                        {/*<InputLabel htmlFor="outlined-adornment-amount">
                            Amount
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            value=""
                            startAdornment={
                                <InputAdornment position="start">
                                    $
                                </InputAdornment>
                            }
                            labelWidth={60}
                        />*/}
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={addNewProject} color="primary">
                        Add
                    </Button>
                    <Button onClick={handleClearForm} color="primary">
                        Clear Form
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PopupModal;
