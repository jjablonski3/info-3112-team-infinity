import React from 'react';
import TextField from '@material-ui/core/TextField';
import "../App.css";


const Subtask = ({props}) => {

    const populateSubtasks = async () => {
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

    const StorySubtasks = ({subtasks}) => (
        <>
          {subtasks.map(subtask => (
              <div>
                <TextField id="sub-task-description" defaultValue={subtask.description}/>
                <TextField id="sub-task-teammember" defaultValue={subtask.teammember}/>
                <TextField id="sub-task-hoursworked" type="number" defaultValue={subtask.hoursworked}/>
              </div>
            
          ))}
        </>
    ); 

  return (
    <div>
        <TextField id="sub-task" defaultValue="SubtaskDescription" />
    </div>
  );
};
export default Subtask;
