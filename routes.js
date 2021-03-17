const express = require("express");
const router = express.Router();
const dbRtns = require("./dbroutines");

router.post("/projectinformation", async (req, res) => {
  try {
    //define variables from cliet post fetch through body
      let teamname = req.body.teamname;
      let product = req.body.product;
      let project_start_date = req.body.start_date;
      let story_hours = req.body.story_hours;
      let estimated_storypoints = req.body.estimated_storypoints;
      let estimated_cost = req.body.estimated_cost;
      let results = await dbRtns.addProjectInformation(teamname, product, project_start_date, story_hours, estimated_storypoints, estimated_cost);
      res.status(200).send({results:results});
      
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("get all users failed - internal server error");
  }
});

router.get("/projectinformation", async (req, res) => {
  try {
    let rows;  
    let results = await dbRtns.getProjectInformation();
    rows = results.rows;
    res.status(200).send({rows:rows});
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("get all users failed - internal server error");
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
    res.status(500).send("get all users failed - internal server error");
  }
});
  
router.get("/teammembers", async (req, res) => {
  try {
    let rows;  
    let results = await dbRtns.getTeamMembers();
    rows  = results.rows;
    res.status(200).send({rows:rows});
      
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("get all users failed - internal server error");
  }
});

router.post("/userstory", async (req, res) => {
  try {
    //define variables from cliet post fetch through body
      let initialcost = req.body.initialcost;
      let relativeestimate = req.body.relativeestimate;
      let statement = req.body.statement;
      let results = await dbRtns.addTeamMembers(initialcost, relativeestimate, statement);
      res.status(200).send({results:results});
      
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("get all users failed - internal server error");
  }
});

router.get("/userstory/:id", async (req, res) => {
  try {
    let rows;  
    let results = await dbRtns.getAllStories();
    rows  = results.rows;
    res.status(200).send({rows:rows});
      
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("get all users failed - internal server error");
  }
});

router.get("/userstory/:id", async (req, res) => {
  try {
    let row;  
    let id = req.params.id;
    let results = await dbRtns.getSelectedStory(id);
    rows  = results.rows;
    res.status(200).send({rows:row});
      
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("get all users failed - internal server error");
  }
});
  
module.exports = router;
