import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import "../App.css";

const Subtasks = ({ props }) => {
    const [subtasksArr, setSubtasksArr] = useState([]);
    const [teammembersArr, setTeammembersArr] = useState([]);
    const [openSubtaskModal, setOpenSubtaskModal] = useState(false);
    const [openTeammemberModal, setOpenTeammemberModal] = useState(false);
    const [SubtaskDesc, setSubtaskDesc] = useState("");
    const [hoursWorked, setHoursWorked] = useState(0.0);
    const [estHoursToComplete, setEstHoursToComplete] = useState(0.0);
    const [selectedTeammember, setSelectedTeammember] = useState("");
    const [selectedTeammemberId, setSelectedTeammemberId] = useState(0);
    const [teammemberFName, setTeammemberFName] = useState("");
    const [teammemberLName, setTeammemberLName] = useState("");

    //load the subtasks on mount
    useEffect(() => {
        fetchSubtasks();
        fetchTeamMembersForProject();
    }, []);

    //get the subtasks for the story parent (id passed through props)
    const fetchSubtasks = async () => {
        try {
            let response = await fetch(
                `http://localhost:5000/api/subtasks/${props.storyId}`
            );
            let json = await response.json();
            setSubtasksArr(json?.rows);
        } catch (error) {
            alert(
                "failed to process the fetchSubtasks request: " +
                    error.toString()
            );
            console.log(error);
        }
    };

    /*LEAVE in incase we need
    const fetchTeamMembersForProject = async () => {
        try {
            let response = await fetch(
                `http://localhost:5000/api/teammembersforproject/${props.projId}`
            );
            let json = await response.json();
            setTeammembersArr(json?.rows);
            console.log('mems');
            console.log(json);
        } catch (error) {
            alert(
                "failed to process the fetchTeamMembersForProject request: " +
                    error.toString()
            );
            console.log(error);
        }
    };*/


    const fetchTeamMembersForProject = async () => {
      try {
          let response = await fetch(
              `http://localhost:5000/api/teammembers`
          );
          let json = await response.json();
          setTeammembersArr(json?.rows);
          console.log('mems');
          console.log(json);
      } catch (error) {
          alert(
              "failed to process the fetchTeamMembers request: " +
                  error.toString()
          );
          console.log(error);
      }
  };

    const addNewSubtask = async () => {
        const data = {
            description: SubtaskDesc,
            user_story_id: props.storyId,
            team_member_assigned: selectedTeammemberId,
            hours_worked: hoursWorked,
            hours_to_complete_estimate: estHoursToComplete,
        };

        try {
            const response = await fetch("http://localhost:5000/api/subtasks", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(data),
            });

            const output = await response.json();
            if (output?.results?.rowCount > 0) {
                alert(
                    `Inserted ${output?.results?.rowCount} Subtasks Successfully!`
                );
            } else {
                alert(`Insert subtask failed`);
            }
            handleClearForm();
            handleSubtaskModalClose();
        } catch (err) {
            alert(
                "failed to process the addNewSubtasks request: " +
                    err.toString()
            );
            console.log(err);
        }
    };

    const addNewTeammember = async () => {
        const data = {
            firstname: teammemberFName,
            lastname: teammemberLName,
        };

        try {
            const response = await fetch(
                "http://localhost:5000/api/teammembers",
                {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(data),
                }
            );

            const output = await response.json();
            if (output?.results?.rowCount > 0) {
                alert(
                    `Inserted ${output?.results?.rowCount} Team members Successfully!`
                );
            } else {
                alert(`Insert Team member failed`);
            }
            handleClearTeammember();
            handleTeammemberModalClose();
        } catch (err) {
            alert(
                "failed to process the Team members request: " + err.toString()
            );
            console.log(err);
        }
    };

    const handleNewSubtask = () => {
        console.log("newsubtask");
        setOpenSubtaskModal(true);
    };

    const handleSubtaskModalClose = () => {
        setOpenSubtaskModal(false);
        //refresh to show the new subtask
        fetchSubtasks();
    };

    const handleNewTeammember = () => {
        setOpenTeammemberModal(true);
    };

    const handleTeammemberModalClose = () => {
        setOpenTeammemberModal(false);
        //refresh to show the new teammember
        console.log('tmclose');
        fetchTeamMembersForProject();
    };

    const handleTxtFieldInput = (ev) => {
        console.log(ev.target.id);
        switch (ev.target.id) {
            case "subtask-description":
                setSubtaskDesc(ev.target.value);
                break;
            case "hours-worked":
                setHoursWorked(parseFloat(ev.target.value));
                break;
            case "hours-to-complete-estimate":
                setEstHoursToComplete(parseFloat(ev.target.value));
                break;
            case "first-name": 
                setTeammemberFName(ev.target.value);
                break;
            case "last-name":
                setTeammemberLName(ev.target.value);
                break;
        }
    };

    const handleClearTeammember = (ev) => {
        setTeammemberFName("");
        setTeammemberLName("");
        setSelectedTeammember("");
        setSelectedTeammemberId(0);
    };

    const handleClearForm = (ev) => {
        setSubtaskDesc("");
        setHoursWorked(0);
        setEstHoursToComplete(0);
    };

    const handleDropdownChange = (ev) => {
        let teamMem = ev.target.value
        let data = ev.currentTarget?.getAttribute("data");
        console.log(teamMem);
        console.log(data);
        setSelectedTeammember(teamMem);
        setSelectedTeammemberId(data);
    };

    return (
        <div>
            <TextField id="tester" defaultValue="SubtaskDescription" />
            {subtasksArr?.map((subtask, keyIndex) => (
                <div key={keyIndex}>
                    <br />
                    <br />
                    <TextField
                        id={`sub-task-description-${keyIndex}`}
                        defaultValue={subtask.description}
                    />
                    <TextField
                        id={`sub-task-teammember-${keyIndex}`}
                        defaultValue={subtask.team_member_assigned}
                    />
                    <TextField
                        id={`sub-task-hoursworked-${keyIndex}`}
                        type="number"
                        defaultValue={subtask.hours_worked}
                    />
                </div>
            ))}
            <Divider />
            <ListItem button onClick={handleNewSubtask}>
                <ListItemIcon>
                    <AddCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Add Subtask" />
            </ListItem>
            <Divider />
            <Dialog onClose={handleSubtaskModalClose} open={openSubtaskModal}>
                <DialogTitle id="modal-title-subtasks">
                    Add New Subtask
                </DialogTitle>
                <TextField
                    id="subtask-description"
                    label="Subtask description"
                    variant="outlined"
                    onChange={handleTxtFieldInput}
                    value={SubtaskDesc}
                />
                <TextField
                    type="number"
                    id="hours-worked"
                    label="Hours worked"
                    variant="outlined"
                    onChange={handleTxtFieldInput}
                    value={hoursWorked}
                />
                <TextField
                    type="number"
                    id="hours-to-complete-estimate"
                    label="Hours To Complete Estimate"
                    variant="outlined"
                    onChange={handleTxtFieldInput}
                    value={estHoursToComplete}
                />
                <FormControl>
                    <InputLabel id="team-member-label">Team Member</InputLabel>
                    <Select
                        labelId="team-member-label"
                        id="team-member"
                        value={selectedTeammember}
                        onChange={handleDropdownChange}
                    >
                        {teammembersArr?.map((member, keyIndex) => (
                            <MenuItem value={`${member?.team_member_id} - ${member?.first_name} ${member?.last_name}`} data={member?.team_member_id} key={keyIndex}>
                                {member?.team_member_id} - {member?.first_name} {member?.last_name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Divider />
                        <ListItem button onClick={handleNewTeammember}>
                            <ListItemIcon>
                                <AddCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Add Teammember"/>
                        </ListItem>
                        <Divider />
                </FormControl>
                <Button autoFocus onClick={addNewSubtask} color="primary">
                    Add
                </Button>
                <Button onClick={handleClearForm} color="primary">
                    Clear Form
                </Button>
            </Dialog>
            <Dialog
                onClose={handleTeammemberModalClose}
                open={openTeammemberModal}
            >
                <TextField
                    id="first-name"
                    variant="outlined"
                    onChange={handleTxtFieldInput}
                    value={teammemberFName}
                    label="First Name"
                ></TextField>
                <TextField
                    id="last-name"
                    variant="outlined"
                    onChange={handleTxtFieldInput}
                    value={teammemberLName}
                    label="Last Name"
                ></TextField>
                <Button autoFocus onClick={addNewTeammember} color="primary">
                    Add Team Member
                </Button>
            </Dialog>
        </div>
    );
};
export default Subtasks;
