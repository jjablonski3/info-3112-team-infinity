const express = require("express");
const router = express.Router();
const dbRtns = require("./dbroutines");
const Report = require('fluentreports').Report;

router.post("/projectinformation", async (req, res) => {
  try {
    //define variables from cliet post fetch through body
      let teamname = req.body.teamname;
      let product = req.body.product;
      let project_start_date = new Date().toISOString();
      let story_hours = req.body.story_hours;
      let estimated_storypoints = req.body.estimated_storypoints;
      let estimated_cost = req.body.estimated_cost;
      let results = await dbRtns.addProjectInformation(teamname, product, project_start_date, story_hours, estimated_storypoints, estimated_cost);
      res.status(200).send({results:results});
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("add project info failed - internal server error");
  }
});

router.get("/projectinformation", async (req, res) => {
  try {
    let rows;  
    let results = await dbRtns.getProjectInformation();
    rows = results?.rows;
    res.status(200).send({rows:rows});
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("get project info failed - internal server error");
  }
});

router.get("/projectinformationwithsprints", async (req, res) => {
  try {
    let rows;  
    let results = await dbRtns.getProjectInformationWithSprints();
    rows = results?.rows;
    res.status(200).send({rows:rows});
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("get project info failed - internal server error");
  }
});

router.post("/teammembers", async (req, res) => {
  try {
    //define variables from cliet post fetch through body
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let results = await dbRtns.addTeamMembers(firstname, lastname);
    res.status(200).send({results:results});
        
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("add team member failed - internal server error");
  }
});
  
router.get("/teammembers", async (req, res) => {
  try {
    let rows;  
    let results = await dbRtns.getTeamMembers();
    rows  = results?.rows;
    res.status(200).send({rows:rows});
      
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("get all team members failed - internal server error");
  }
});

//
router.get("/teammembersforproject/:id", async (req, res) => {
  try{
    let id = req.params.id
    let rows;
    let results = await dbRtns.getTeammembersForProject(id);
    rows = results?.rows;
    res.status(200).send({rows:rows});

  }catch (err) {
    console.log(err.stack);
    res.status(500).send("get teammembersforproject data failed - internal server error");
  }
  
});


router.get("/sprint", async (req, res) =>{
  try{
    let rows;
    let results = await dbRtns.getAllSprints();
    rows = results?.rows;
    res.status(200).send({rows:rows});

  }catch (err) {
    console.log(err.stack);
    res.status(500).send("get sprint data failed - internal server error");
  }
});

router.get("/sprint/:id", async (req, res) => {
  try{
    let id = req.params.id
    let rows;
    let results = await dbRtns.getSprintById(id);
    rows = results?.rows;
    res.status(200).send({rows:rows});

  }catch (err) {
    console.log(err.stack);
    res.status(500).send("get sprint data failed - internal server error");
  }
  
});

router.get("/sprints/:id", async (req, res) => {
  try{
    let id = req.params.id
    let rows;
    let results = await dbRtns.getSprintsByProjId(id);
    rows = results?.rows;
    res.status(200).send({rows:rows});

  }catch (err) {
    console.log(err.stack);
    res.status(500).send("get sprint data failed - internal server error");
  }
  
});

router.post("/sprint", async(req, res) =>{
  try {
    //define variables from cliet post fetch through body
      let projectid = req.body.project_information_id;
      let is_initial_backlog_sprint = req.body.is_initial_backlog_sprint;
      let final_sprint = req.body.is_final_completion_sprint;
      let sprint_begin_date = new Date().toISOString();
      let results = await dbRtns.addSprint(projectid, is_initial_backlog_sprint, final_sprint, sprint_begin_date);
      res.status(200).send({results:results});      
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("adding sprint failed - internal server error");
  }
});

router.post("/userstory", async (req, res) => {
  try {
    //define variables from cliet post fetch through body
      let initialcost = req.body.initialcost;
      let relativeestimate = req.body.relativeestimate;
      let statement = req.body.statement;
      
      //for transaction
      let sprintid = req.body.sprintid
      let results = await dbRtns.addStory(initialcost, relativeestimate, statement, sprintid);
      res.status(200).send({results:results});
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("adding story failed - internal server error");
  }
});

router.post("/sprint_story_instance", async(req, res)=>{
  try{
    let sprint_id = req.body.sprint_id;
    let story_id = req.body.story_id;
    let results = await dbRtns.addSprintStoryInstance(sprint_id, story_id);
    res.status(200).send({results:results});
  }catch(err){
    console.log(err.stack);
    res.status(500).send("adding sprint-story instance failed - internal server error");
  }
});

router.get("/userstory", async (req, res) => {
  try {
    let projectid = req.body.id;
    let rows;  
    let results = await dbRtns.getAllStories(projectid);
    rows  = results?.rows;
    res.status(200).send({rows:rows});
      
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("get all stories failed - internal server error");
  }
});

router.put("/userstory", async (req, res) => {
  try {
    let userstory = req.body.user_story_id;
    let completiondate = req.body.completion_date;
    let results = await dbRtns.updateUserStory(userstory, completiondate);
    rows  = results?.rows;
    res.status(200).send({rows:rows});
      
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("adding story failed - internal server error");
  }
});

router.get("/userstory/:id", async (req, res) => {
  try {
    let row;  
    let id = req.params.id;
    let results = await dbRtns.getSelectedStory(id);
    rows  = results?.rows;
    res.status(200).send({rows:row});
      
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("getting story failed - internal server error");
  }
});

router.get("/stories/:id", async (req, res) => {
  try {
    let rows;  
    let id = req.params.id //sprint id.
    let results = await dbRtns.getStoriesBySprint(id);
    rows  = results?.rows;
    res.status(200).send({rows:rows});
      
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("getting subtask failed - internal server error");
  }
});

router.post("/subtasks", async (req, res) =>{
  try {
    //define variables from cliet post fetch through body
      let description = req.body.description;
      let user_story_id = req.body.user_story_id;
      let team_member_assigned = req.body.team_member_assigned;
      let hours_worked = req.body.hours_worked;
      let hours_to_complete_estimate = req.body.hours_to_complete_estimate;
      let results = await dbRtns.addSubtask(description, user_story_id, team_member_assigned, hours_worked, hours_to_complete_estimate);
      res.status(200).send({results:results});
      
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("adding subtask failed - internal server error");
  }
});

router.get("/subtasks/:id", async (req, res) => {
  try {
    let rows;  
    let id = req.params.id //story id.
    let results = await dbRtns.getSubtasksForStory(id);
    rows  = results.rows;
    res.status(200).send({rows:rows});
      
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("getting subtask failed - internal server error");
  }
});

router.put("/subtasks/:id", async (req, res) => {
  try {

    let id = req.params.id //subtask id.
    let hours_worked = req.params.hours_worked;
    let estimate = req.params.hours_to_complete_estimate;
    let results = await dbRtns.updateSubtask(id, hours_worked, estimate);
    res.status(200).send({results:results});
      
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("updating subtask failed - internal server error");
  }
});




router.get("/sprintsummary", async(req, res)=>{
  res.set('Content-Type', 'application/pdf');
  try{
    //need objects for pdf summary
    //get all stories from sprint
    //get all subtask data and map to story array.

    let sprintresults = (await dbRtns.getStoriesBySprint(9000)).rows;
    let storyobjects = [];
    await Promise.all(sprintresults.map(async (story) =>{
      let data = await dbRtns.getSubtasksForStory(story.user_story_id);
      storyobjects.push({
        story: {story: story.i_want_to_statement, points: story.intial_estimated_cost, hours: story.intial_relative_estimate},
        subtasks: data.rows
      });
    }));
    

  let totalworked = 0;
  let totalremain = 0;
  let totalStoryPoints = 0;
  let totalEstimate = 0;
    const details = function (x, r) {
      x.newline();

      x.fontSize(9);
      let subtaskarray = [];
      subtaskarray = r.subtasks;
      let storydata = [];
      storydata= r.story;
      totalStoryPoints += parseInt(storydata.points);
      totalEstimate += parseFloat(storydata.hours);
      x.band([
        {data: storydata.story, width:200},
        {data: storydata.points, width:60, align: 2},
        {data: storydata.hours, width:100, align: 2}
      ], { fontBold:true})
      for(const subtask of subtaskarray){
        x.band([
          {data: subtask.description, width: 320},
          {data: subtask.hours_worked, width: 100, align: 2},
          {data: subtask.hours_to_complete_estimate, width: 120, align: 2},
          {data: subtask.name, width: 100, align: 1, fontBold:true}
          
      ], {x: 30, border:1});
      totalworked += parseFloat(subtask.hours_worked);
      totalremain += parseFloat(subtask.hours_to_complete_estimate);
    };
  };
  const detailsFooter = function (x) {
    x.fontSize(10);
    x.newline();

    x.band([
      {data: "Total", width: 175},
      {data: totalStoryPoints, width: 60},
      {data: totalEstimate, width: 80},
      {data: totalworked , width: 90},
      {data: totalremain, width: 110},
      
    ], {fontBold:true})
  };

  const detailsHeader = function(x) {
    x.fontSize(10);
    x.band([
      {data: "Story/Subtasks", width: 200},
      {data: "Story Points  | ", width: 70},
      {data: "Hours Estimate  | ", width: 80},
      {data: "Actual Hours Worked  |" , width: 110},
      {data: "Estimate to Complete  | ", width: 110},
      {data: "Team Member", width: 100},
    ])
  };
    //const report = new Report(pipeStream).data(storyobjects);
    const report = new Report(res, {landscape:true})
          .data(storyobjects)
          .groupBy("no")
          .header(detailsHeader)
          .detail(details)
          .footer(detailsFooter)
          .render(function() {res.send();});
        
    
    
    
    
    

    //res.send(report);



    //res.status(200).send({data:storyobjects});
  }catch (err) {
    console.log(err.stack);
    res.status(500).send("get sprint summary failed - internal server error");
  }
  
});


















module.exports = router;
