import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import "../App.css";


const Subtasks = ({props}) => {
    const [subtasksArr, setSubtasksArr] = useState([]);

    //load the subtasks on mount
    useEffect(() => {
        fetchSubtasks();
    }, []);

    //get the subtasks for the story parent (id passed through props)
    const fetchSubtasks = async () => {
        try {
            let response = await fetch(`http://localhost:5000/api/subtasks/${props.storyId}`);
            let json = await response.json();
            setSubtasksArr(json?.rows);
        } catch (error) {
            alert("failed to process the request: " + error.toString());
            console.log(error);
        }
    };

  return (
    <div>
        <TextField id="tester" defaultValue="SubtaskDescription" />
        {subtasksArr?.map((subtask, keyIndex) => (
              <div key={keyIndex}>
                <br/>
                <br/>
                <TextField id={`sub-task-description-${keyIndex}`} defaultValue={subtask.description}/>
                <TextField id={`sub-task-teammember-${keyIndex}`} defaultValue={subtask.team_member_assigned}/>
                <TextField id={`sub-task-hoursworked-${keyIndex}`} type="number" defaultValue={subtask.hours_worked}/>
              </div>
          ))}
    </div>
  );
};
export default Subtasks;
