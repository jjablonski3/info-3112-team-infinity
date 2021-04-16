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




router.get("/sprintsummary/:projectid", async (req, res) => {
  res.set("Content-Type", "application/pdf");
  try {
    //need objects for pdf summary
    //get all stories from sprint
    //get all subtask data and map to story array.
    let projectid = req.params.projectid; //subtask id.
    let id = (await dbRtns.getCurrentSprint(projectid)).rows[0].sprint_id;
    
    let sprintresults = (await dbRtns.getStoriesBySprint(id)).rows;
    let sprintcount = (await dbRtns.getSprintNumber(projectid)).rows[0].count;
    console.log(sprintcount);
    let storyobjects = [];
    await Promise.all(
      sprintresults.map(async (story) => {
        let data = await dbRtns.getSubtasksForStory(story.user_story_id);
        storyobjects.push({
          story: {
            story: story.i_want_to_statement,
            points: story.initial_estimated_cost,
            hours: story.initial_relative_estimate
          },
          subtasks: data.rows,
        });
      })
    );

    let projectinfo = (await dbRtns.getProjectInformation()).rows[7];
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
      storydata = r.story;
      totalStoryPoints += parseInt(storydata.points);
      totalEstimate += parseFloat(storydata.hours);
      x.print(storydata.story, {fontBold:true, fontSize:10});
      x.print("", {width: 350});

      // x.band(
      //   [
      //     { data: storydata.points, width: 250, align: 3 },
      //     { data: storydata.hours, width: 100, align: 2 },
      //   ],         { fontBold: true }
      // )
      let subtaskActual = 0;
      let subtaskEstimateRemain = 0;
      for (const subtask of subtaskarray) {
        subtaskActual += parseFloat(subtask.hours_worked);
        subtaskEstimateRemain += parseFloat(subtask.hours_to_complete_estimate);
        x.band(
          [
            { data: subtask.description, width: 320 , align: 3},
            { data: subtask.name, width: 100, align: 2, fontBold: true },
            { data: "", width: 50, align: 2 },
            { data: subtask.hours_worked, width: 70, align: 2 },
            { data: subtask.hours_to_complete_estimate, width: 60, align: 2 },
          ],
          { x: 30, border: 1 }
        );
        totalworked += parseFloat(subtask.hours_worked);
        totalremain += parseFloat(subtask.hours_to_complete_estimate);
      }
      x.newline();
      x.print("Original Hours Estimate: " + storydata.hours, {fontSize: 11, fontBold:true, align:"right", width:475})
      let percentComplete = 0;
      if(totalremain === 0)
      {
        percentComplete = '100%'
      }
      else
      {
        percentComplete = (totalremain / (totalworked + totalremain)) *100;
      }
      x.band(
        [
          { data: "Subtask Totals", width: 350 , align: "right"},
          { data: "", width: 100},
          { data: percentComplete, width: 50, align: "center" },
          { data: subtaskActual, width: 65, align: "center" },
          { data: subtaskEstimateRemain, width: 70, align: "center" },
        ],
        { fontBold: true }
      );
      x.newline();
    };
    const detailsFooter = function (x) {
      let percentComplete = '100%';
      x.fontSize(12);
      x.newline();
      x.band([
        { data: "", width: 150 },
        { data: "Percent Complete", width: 100, align:"center"},
        { data: "Hours Estimate", width: 100, align:"center" },
        { data: "Actual Hours Worked", width: 120, align:"center" },
        { data: "Estimate to Complete", width: 120, align:"center" },
      ]);
      x.band(
        [
          { data: "Sprint Totals", width: 150, align:"right" },
          { data: percentComplete, width: 100, align:"center"},
          { data: totalEstimate, width: 100, align:"center" },
          { data: totalworked, width: 120, align:"center" },
          { data: totalremain, width: 120, align:"center" },
        ],
        { fontBold: true }
      );
    };

    const detailsHeader = function (x) {
      x.fontSize(10);
      x.band([
        { data: "Story/Subtasks", width: 350 },
        { data: "Team Member", width: 95, align:"center" },
        { data: "| Percent", width: 50, align:"center" },
        { data: "| Actual Hours |", width: 75, align:"center" },
        { data: "Estimate to | ", width: 110 },
      ]);
      x.band([
        { data:"", width: 450 },
        { data: "Complete", width: 50, align:"center" },
        { data: "Worked", width: 70, align:"center" },
        { data: "Complete", width: 55,  align:"center" },
      ]);
    };

    const reportHeader = function (x) {
      
      let formatteddate = (projectinfo.project_start_date).toString();
      formatteddate = formatteddate.slice(0,15);
      x.fontSize(10);
      x.print('Team Infinity', {x: 50, y:60, fontSize:28});
      x.print(`Sprint #3 Report`, {x: 50, fontSize:24});
      x.band([{data:`Project name:`, width:120},
              {data: `${projectinfo.product_name}`, width:120}],
              {x:400, y: 60});
      x.band([{data:`Project Start Date: `, width:120},
              {data:`${formatteddate}`, width:120}],
              {x:400});

      x.band([{data:`Story Point Conversion: `, width:120},
              {data:`${projectinfo.hours_per_storypoint}`, width:120, align:"left"}],
              {x:400});
      
      x.band([{data:`Project Story Points: `, width:120},
            {data: `${projectinfo.total_estimated_storypoints}`, width:120, align:"left"}],
            {x:400});
      x.band([{data:`Cost Estimate: `, width: 120},
            {data: `${projectinfo.total_estimated_cost}`, width:120, align:"left"}],
            {x:400});
      x.newline();

    };



    //const report = new Report(pipeStream).data(storyobjects);
    const report = new Report(res, { landscape: true})
      .data(storyobjects)
      .groupBy("no")
      .header(reportHeader)
      .groupBy("no")
      .header(detailsHeader)
      .detail(details)
      .footer(detailsFooter)
      .render(function () {
        res.send();
      });

    //res.send(report);

    //res.status(200).send({data:storyobjects});
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("get sprint summary failed - internal server error");
  }
});


















module.exports = router;
