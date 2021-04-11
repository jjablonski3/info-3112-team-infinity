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
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import { OutlinedInput, InputAdornment } from "@material-ui/core";

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
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

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const SprintModal = (props) => {
    const [isBacklog, setIsBacklog] = React.useState(false);

    const handleToggle = () => {
        setIsBacklog(!isBacklog);
    };

    const addNewSprint = async () => {
        const data = {
            project_information_id: props.projId,
            is_initial_backlog_sprint: isBacklog,
            is_final_completion_sprint: false,
        };

        try {
            const response = await fetch("http://localhost:5000/api/sprint", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(data),
            });

            const output = await response.json();
            if (output?.results?.rowCount > 0) {
                alert(
                    `Inserted ${output.results.rowCount} Sprints Successfully!`
                );
            } else {
                alert(`Insert sprint failed`);
            }
            props.closeModal();
        } catch (err) {
            alert(
                "failed to process the addNewSprint request: " + err.toString()
            );
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
                    Add New Sprint
                </DialogTitle>
                <DialogContent dividers>
                    <form id="newSprintForm" noValidate autoComplete="off">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isBacklog}
                                    onChange={handleToggle}
                                    name="checkedA"
                                />
                            }
                            label="Will this be the product backlog?"
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={addNewSprint} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SprintModal;
