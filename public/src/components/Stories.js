

import "../App.css";
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Subtasks from "./Subtasks";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const Stories = (props) => {
  const [open, setOpen] = useState(false);
  const [openStoryModal, setOpenStoryModal] = useState(false);
  const [currentStory, setCurrentStory] = useState(null);
  const [storiesArr, setStoriesArr] = useState([]);
  const [iWantToStatement, setIWantToStatement] = useState("");
  const [initEstCost, setInitEstimatedCost] = useState(0.0);
  const [initRelativeEst, setInitRelativeEst] = useState(0.0);
  const [mode, setMode] = useState(false);
  

  //load the stories on mount
  useEffect(() => {
    console.log('inStoriesComponent000');
    fetchStories();
    setMode(props?.user);

  }, [props]);

  //get the stories for the sprint parent (id passed through props)
  const fetchStories = async () => {
      try {
          let response = await fetch(`http://localhost:5000/api/stories/${props?.parentsprint?.sprintId}`);
          let json = await response.json();
          setStoriesArr(json?.rows);
          console.log(json?.rows);
      } catch (error) {
          alert("failed to process the fetchStories request: " + error.toString());
          console.log(error);
      }
  };

const handleNewStory = () => { 
  console.log('newstory')
  setOpenStoryModal(true);
};

const handleStoryModalClose = () => {
  setOpenStoryModal(false);
  //refresh to show the new sprint
  fetchStories();
};

const handleStoryClickOpen = (story) => {
  setCurrentStory(story);
  setOpen(true);  
};

const handleClose = (value) => {
  setOpen(false);
};

const handleTxtFieldInput = ev => {
  console.log(ev.target.id);
  switch (ev.target.id) {
      case "i-want-to-statement":
        setIWantToStatement(ev.target.value);
        break;
      case "initial-estimated-cost":
        setInitEstimatedCost(parseFloat(ev.target.value));
        break;
      case "initial-relative-estimate":
        setInitRelativeEst(parseFloat(ev.target.value));
        break;
  }
};

const handleClearForm = ev => {
  setIWantToStatement("");
  setInitEstimatedCost(0);
  setInitRelativeEst(0);
};

const generateSprintReport = () =>{
  window.open(`http://localhost:5000/api/sprintsummary/${props?.parentproj.projid}`);
}
const addNewStory = async () => {
  const data = {
    statement: iWantToStatement,
    relativeestimate: initRelativeEst,
    initialcost: initEstCost,
    sprintid: props?.parentsprint?.sprintId
  };

  try {
      const response = await fetch(
          "http://localhost:5000/api/userstory",
          {
              method: "POST",
              headers: { "Content-type": "application/json" },
              body: JSON.stringify(data)
          }
      );

      const output = await response.json(); 
      if(output?.results?.rowCount > 0){
          alert(`Inserted ${output?.results?.rowCount} Stories Successfully!`);
      }
      else{
          alert(`Insert story failed`);
      }
      handleClearForm();
      handleStoryModalClose();
  } catch (err) {
      alert("failed to process the addNewStory request: " + err.toString());
      console.log(err);
  }
};

  return (
    <div>
      <Button 
        color="secondary"
        variant="contained"
        disabled={mode}
        onClick={generateSprintReport}
        >
        Generate Last Sprint Report
      </Button>
        {storiesArr?.map((story, keyIndex) => (
          <div key={keyIndex}>
            <br/>
            <br/>
            <TextField id={`story-description-${keyIndex}`} defaultValue={story.i_want_to_statement}/>
            <TextField id={`story-storyid-${keyIndex}`} defaultValue={story.user_story_id}/>
            <Button onClick={() => handleStoryClickOpen(story)}>test</Button>
          </div>
        ))}
        <Divider />
        <ListItem button onClick={handleNewStory}>
            <ListItemIcon>
                <AddCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Add Story" />
        </ListItem>
        <Divider />
        <Dialog onClose={handleStoryModalClose} open={openStoryModal}>
            <DialogTitle id="modal-title-subtasks">Add New Story</DialogTitle>
            <TextField
                id="i-want-to-statement"
                label="I Want To Statment"
                variant="outlined"
                onChange={handleTxtFieldInput}
                value={iWantToStatement}
            />
            <TextField
                type="number"
                id="initial-estimated-cost"
                label="Estimated Cost"
                variant="outlined"
                onChange={handleTxtFieldInput}
                value={initEstCost}
            />
            <TextField
                type="number"
                id="initial-relative-estimate"
                label="Relative Estimate"
                variant="outlined"
                onChange={handleTxtFieldInput}
                value={initRelativeEst}
            />
            <Button autoFocus onClick={addNewStory} color="primary">
                Add
            </Button>
            <Button onClick={handleClearForm} color="primary">
                Clear Form
            </Button>
          </Dialog>
        {currentStory && 
          <Dialog onClose={handleClose} open={open}>
            <DialogTitle id="modal-title-subtasks">Subtasks for Story: {currentStory.i_want_to_statement}</DialogTitle>
            <Subtasks props={{storyId: currentStory.user_story_id, projId: props?.parentproj?.projid}}></Subtasks>
          </Dialog>
        }

    </div>
  );
};
export default Stories;
