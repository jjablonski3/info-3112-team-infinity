

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

const Stories = ({props}) => {
  const [open, setOpen] = useState(false);
  const [currentStory, setCurrentStory] = useState(null);
  const [storiesArr, setStoriesArr] = useState([]);

  //load the stories on mount
  useEffect(() => {
      fetchStories();
  }, []);

  //get the stories for the sprint parent (id passed through props)
  const fetchStories = async () => {
      try {
          let response = await fetch(`http://localhost:5000/api/stories/${props.sprintId}`);
          let json = await response.json();
          setStoriesArr(json?.rows);
      } catch (error) {
          alert("failed to process the request: " + error.toString());
          console.log(error);
      }
  };

const handleStoryClickOpen = (story) => {
  setCurrentStory(story);
  setOpen(true);  
};

const handleClose = (value) => {
  setOpen(false);
};

  return (
    <div>
        {storiesArr?.map((story, keyIndex) => (
          <div key={keyIndex}>
            <br/>
            <br/>
            <TextField id={`story-description-${keyIndex}`} defaultValue={story.i_want_to_statement}/>
            <TextField id={`story-storyid-${keyIndex}`} defaultValue={story.user_story_id}/>
            <Button onClick={() => handleStoryClickOpen(story)}>test</Button>
          </div>
        ))}
        {currentStory && 
          <Dialog onClose={handleClose} open={open}>
            <DialogTitle id="modal-title-subtasks">Subtasks for Story: {currentStory.i_want_to_statement}</DialogTitle>
            <Subtasks props={{storyId: currentStory.user_story_id}}></Subtasks>
          </Dialog>
        }
    </div>
  );
};
export default Stories;
