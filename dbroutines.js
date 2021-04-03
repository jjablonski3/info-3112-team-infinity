const { Pool } = require('pg')
const {username, dburl, database, authorization} = require("./config"); 
const port = 5432

const pool = new Pool({
    user: username,
    host: dburl,
    database: database,
    password: authorization,
    port: port,
    ssl: { rejectUnauthorized: false },
    max: 25,
    connectionTimeoutMillis: 0, //won't timeout
    idleTimeoutMillis:0, //won't timeout
});

const addProjectInformation = async (team, product, date, storyhours, estimatedestorypoints, esimatedcost) =>{
    const query = {
        text: `INSERT INTO project_information 
                            ( team_name, product_name, project_start_date, hours_per_storypoint, total_estimated_storypoints, total_estimated_cost)
                VALUES 
                    ( '${team}', '${product}', ${date}, ${storyhours}, ${estimatedestorypoints}, ${esimatedcost}  )`
    }
    try{
        let results = await pool.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
}

const getProjectInformation = async () => {
    const query = {
        text: 'SELECT project_information_id, team_name, product_name, project_start_date, hours_per_storypoint, total_estimated_storypoints, total_estimated_cost FROM project_information'
        }
    try{
        let results = await pool.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

/*
        (
            SELECT row_to_json(sprintRecord) FROM
            (
                SELECT spr.sprint_id
                FROM project_information pi
                WHERE pi.project_information_id = spr.project_information_id
            ) sprintRecord
        ) AS ProjSprints,
*/

const getProjectInformationWithSprints = async () => {
    const query = {
        text: `
        SELECT pi.project_information_id, pi.product_name,
        coalesce(
            (
                SELECT array_to_json(array_agg(row_to_json(sprintRecords)))
                FROM (
                    SELECT spr.sprint_id, spr.is_initial_backlog_sprint, spr.is_final_completion_sprint, spr.sprint_begin_date, spr.sprint_end_date
                    FROM sprint spr
                    WHERE pi.project_information_id = spr.project_information_id
                )sprintRecords
            ),
            '[]'
        ) AS sprintsData
        FROM project_information pi
        `
    }
    try{
        let results = await pool.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const addTeamMembers = async (firstname, lastname) =>{
    const query = {
        text: `INSERT INTO team_member ( first_name, last_name )
               VALUES ( '${firstname}', '${lastname}' )`
    }
    try{
        let results = await pool.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const getTeamMembers = async () => {
    const query = {
        text: `SELECT * FROM team_member`
    }
    try{
        let results = await pool.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const getAllSprints = async (projectid) => {
    const query = {
        text: `SELECT * FROM sprint where project_information_id = ${projectid}`
    };
    try{
        let results = await pool.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const getSprintById = async(sprintid) =>{
    const query = {
        text: `SELECT * FROM sprint where sprint_id = ${sprintid}`
    };
    try{
        let results = await pool.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const getSprintsByProjId = async(projectid) =>{
    const query = {
        text: `SELECT sprint_id, pi.project_information_id, is_initial_backlog_sprint, is_final_completion_sprint, sprint_begin_date, sprint_end_date 
        FROM sprint spr
        INNER JOIN project_information pi
        ON spr.project_information_id = pi.project_information_id
        Where pi.project_information_id = ${projectid};`
    };
    try{
        let results = await pool.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const addSprint = async(projectid, isBacklog, isFinalSprint, beginDate) =>{
    const query = {
        text: `INSERT INTO sprint (project_information_id, is_initial_backlog, is_final_completion_sprint, sprint_begin_date) 
        VALUES (${projectid}, ${isBacklog}, ${isFinalSprint}, ${beginDate}) `
    };
    try{
        let results = await pool.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const addStory = async (initialcost, relativeestimate, statement) =>{
    const query = {
        text: `INSERT INTO user_story ( initial_estimated_cost, initial_relative_estimate, i_want_to_statement )
         VALUES ( ${initialcost}, ${relativeestimate}, '${statement}' )`
    };
    try{
        let results = await pool.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const addSprintStoryInstance = async (sprintid, storyid) =>{
    const query ={
        text: `INSERT INTO sprint_user_story_instance(sprint_id, user_story_id)
                VALUES (${sprintid}, ${storyid})`
    };
    try{
        let results = await pool.query(query);
        return results;
    }catch (err){
        console.log(err);
    }
};

const getAllStories = async () => {
    const query = {
        text: $`SELECT * FROM user_story`
    };
    try{
        let results = await pool.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const updateUserStory = async(userstory, completiondate) => {
    const query = {
        text: `UPDATE user_story
                SET completion_date = ${completiondate}
                WHERE user_story_id = ${userstory}`
    };
    try{
        let results = await pool.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};


const getSelectedStory = async (storyid) => {
    const query = {
        text: $`SELECT * FROM user_story WHERE user_story_id = ${storyid}`
    };
    try{
        let results = await pool.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};


const getStoriesBySprint = async(sprintid) =>{
    const query = {
        text: `select * from user_story us 
        inner join sprint_user_story_instance susi 
        on us.user_story_id = susi.user_story_id 
        where susi.sprint_id = ${sprintid};`
    };
    try{
        let results = await pool.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const addSubtask = async (description, user_story_id, team_member_assigned)=> {
    const query = {
        text:`INSERT INTO subtask ( description, user_story_id, team_member_assigned )
               VALUES ${description}, ${user_story_id} ${team_member_assigned}`
    };
    try{
        let results = await pool.query(query);
        return results;
    }catch(err)
    {
        console.log(err);
    }
}

const getSubtasksForStory = async (storyid) => {
    const query = {
        text: `SELECT s.description, s.hours_worked, s.hours_to_complete_estimate, s.team_member_assigned, CONCAT(tm.first_name, ' ', tm.last_name) AS name
        FROM subtask s
        INNER JOIN team_member tm 
        ON s.team_member_assigned = tm.team_member_id
        WHERE s.user_story_id = ${storyid}`
    };
    try{
        let results = await pool.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};

const updateSubtask = async (subtaskid, hours_worked, estimate) =>{
    const query = {
        text: `UPDATE subtasks
                SET hours_worked = ${hours_worked}
                    hours_to_complete_estimate = ${estimate}
                WHERE subtask_id = ${subtaskid}`
    };
    try{
        let results = await pool.query(query);
        return results;

    }catch (err) {
        console.log(err);
    }
};


module.exports= { 
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
        getSprintsByProjId,
        getProjectInformationWithSprints
}

