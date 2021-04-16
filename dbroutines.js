const { Client } = require('pg')
const {username, dburl, database, authorization} = require("./config"); 
const port = 5432
let db;

//Create or test for database instance
const getDBInstance = async() =>{
    if(db){
        return 'already connected';
    }
    try{
        db = new Client({
            user: username,
            host: dburl,
            database: database,
            password: authorization,
            port: port,
            ssl: { rejectUnauthorized: false }
            });
        db.connect();
    }
    catch(err){
        console.log(err);
    }
    return 'creating new connection';
}

const addProjectInformation = async (team, product, date, storyhours, estimatedestorypoints, esimatedcost) =>{
    getDBInstance();
    const query = {
        text: `INSERT INTO project_information 
                            ( team_name, product_name, project_start_date, hours_per_storypoint, total_estimated_storypoints, total_estimated_cost)
                VALUES 
                    ( '${team}', '${product}', ${date}, ${storyhours}, ${estimatedestorypoints}, ${esimatedcost}  )`
    }
    try{
        let results = await db.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
}

const getProjectInformation = async () => {
    getDBInstance();
    const query = {
        text: 'SELECT team_name, product_name, project_start_date, hours_per_storypoint, total_estimated_storypoints, total_estimated_cost FROM project_information'
        }
    try{
        let results = await db.query(query);
        return results;

    }catch (err) {
        console.log(err);
      }

};

const addTeamMembers = async (firstname, lastname) =>{
    getDBInstance();
    const query = {
        text: `INSERT INTO team_member ( first_name, last_name )
               VALUES ( '${firstname}', '${lastname}' )`
    }
    try{
        let results = await db.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const getTeamMembers = async () => {
    getDBInstance();
    const query = {
        text: `SELECT * FROM team_member`
    }
    try{
        let results = await db.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const getAllSprints = async (projectid) => {
    getDBInstance();
    const query = {
        text: `SELECT * FROM sprint where project_information_id = ${projectid}`
    };
    try{
        let results = await db.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const getSprintById = async(sprintid) =>{
    getDBInstance();
    const query = {
        text: `SELECT * FROM sprint where sprint_id = ${sprintid}`
    };
    try{
        let results = await db.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const addSprint = async(projectid, isBacklog, isFinalSprint, beginDate) =>{
    getDBInstance();
    const query = {
        text: `INSERT INTO sprint (project_information_id, is_initial_backlog, is_final_completion_sprint, sprint_begin_date) 
        VALUES (${projectid}, ${isBacklog}, ${isFinalSprint}, ${beginDate}) `
    };
    try{
        let results = await db.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const addStory = async (initialcost, relativeestimate, statement) =>{
    getDBInstance();
    const query = {
        text: `INSERT INTO user_story ( initial_estimated_cost, initial_relative_estimate, i_want_to_statement )
         VALUES ( ${initialcost}, ${relativeestimate}, '${statement}' )`
    };
    try{
        let results = await db.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const addSprintStoryInstance = async (sprintid, storyid) =>{
    getDBInstance();
    const query ={
        text: `INSERT INTO sprint_user_story_instance(sprint_id, user_story_id)
                VALUES (${sprintid}, ${storyid})`
    };
    try{
        let results = await db.query(query);
        return results;
    }catch (err){
        console.log(err);
    }
};

const getAllStories = async () => {
    getDBInstance();
    const query = {
        text: $`SELECT * FROM user_story`
    };
    try{
        let results = await db.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const updateUserStory = async(userstory, completiondate) => {
    getDBInstance();
    const query = {
        text: `UPDATE user_story
                SET completion_date = ${completiondate}
                WHERE user_story_id = ${userstory}`
    };
    try{
        let results = await db.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};


const getSelectedStory = async (storyid) => {
    getDBInstance();
    const query = {
        text: $`SELECT * FROM user_story WHERE user_story_id = ${storyid}`
    };
    try{
        let results = await db.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};


const getStoriesBySprint = async(sprintid) =>{
    getDBInstance();
    const query = {
        text: `select * from user_story us 
        inner join sprint_user_story_instance susi 
        on us.user_story_id = susi.user_story_id 
        where susi.sprint_id = ${sprintid};`
    };
    try{
        let results = await db.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};







const addSubtask = async (description, user_story_id, team_member_assigned)=> {
    getDBInstance();
    const query = {
        text:`INSERT INTO subtask ( description, user_story_id, team_member_assigned )
               VALUES ${description}, ${user_story_id} ${team_member_assigned}`
    };
    try{
        let results = await db.query(query);
        return results;
    }catch(err)
    {
        console.log(err);
    }
}

const getSubtasksForStory = async (storyid) => {
    getDBInstance();
    const query = {
        text: `SELECT s.description, s.hours_worked, s.hours_to_complete_estimate, s.team_member_assigned, CONCAT(tm.first_name, ' ', tm.last_name) AS name
        FROM subtask s
        INNER JOIN team_member tm 
        ON s.team_member_assigned = tm.team_member_id
        WHERE s.user_story_id = ${storyid}`
    };
    try{
        let results = await db.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const updateSubtask = async (subtaskid, hours_worked, estimate) =>{
    getDBInstance();
    const query = {
        text: `UPDATE subtasks
                SET hours_worked = ${hours_worked}
                    hours_to_complete_estimate = ${estimate}
                WHERE subtask_id = ${subtaskid}`
    };
    try{
        let results = await db.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const getCurrentSprint = async(projectid) =>
{
    getDBInstance();
    const query = {
        text: `SELECT sprint_id from sprint where project_information_id = ${projectid} and sprint_end_date < current_date `
    };
    try{
        let results = await db.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
}

const getSprintNumber = async(projectid) =>
{
    getDBInstance();
    const query = {
        text: `SELECT count(*) from sprint where project_information_id = ${projectid} and sprint_end_date < current_date  `
    };
    try{
        let results = await db.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
}

module.exports= {
        getDBInstance, 
        getProjectInformation, 
        addProjectInformation, 
        getTeamMembers, 
        addTeamMembers,
        getAllStories,
        addStory,
        getSelectedStory,
        addSubtask,
        getSubtasksForStory,
        updateSubtask,
        updateUserStory,
        getAllSprints,
        getSprintById,
        addSprint,
        addSprintStoryInstance,
        getStoriesBySprint,
        getCurrentSprint,
        getSprintNumber
}

