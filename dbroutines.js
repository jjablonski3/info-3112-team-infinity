const { Client } = require("pg");
const { username, dburl, database, authorization } = require("./config");
const port = 5432;
let db;

//Create or test for database instance
const getDBInstance = async () => {
    if (db) {
        return "already connected";
    }
    try {
        db = new Client({
            user: username,
            host: dburl,
            database: database,
            password: authorization,
            port: port,
            ssl: { rejectUnauthorized: false }
        });
        db.connect();
    } catch (err) {
        console.log(err);
    }
    return "creating new connection";
};

const addProjectInformation = async (
    team,
    product,
    date,
    storyhours,
    estimatedestorypoints,
    esimatedcost
) => {
    getDBInstance();
    const query = {
        text: `INSERT INTO project_information 
                            ( team_name, product_name, project_start_date, hours_per_storypoint, total_estimated_storypoints, total_estimated_cost)
                VALUES 
                    ( '${team}', '${product}', '${date}', ${storyhours}, ${estimatedestorypoints}, ${esimatedcost}  )`
    };
    try {
        //console.log(query);
        let results = await db.query(query);
        return results;
    } catch (err) {
        console.log(err);
    }
};

const getProjectInformation = async () => {
    getDBInstance();
    const query = {
        text:
            "SELECT team_name, product_name, project_start_date, hours_per_storypoint, total_estimated_storypoints, total_estimated_cost FROM project_information"
    };
    try {
        let results = await db.query(query);
        return results;
    } catch (err) {
        console.log(err);
    }
};

const addTeamMembers = async (firstname, lastname) => {
    getDBInstance();
    const query = {
        text: `INSERT INTO team_member ( first_name, last_name )
               VALUES ( '${firstname}', '${lastname}' )`
    };
    try {
        let results = await db.query(query);
        return results;
    } catch (err) {
        console.log(err);
    }
};

const getTeamMembers = async () => {
    getDBInstance();
    const query = {
        text: `SELECT * FROM team_member`
    };
    try {
        let results = await db.query(query);
        return results;
    } catch (err) {
        console.log(err);
    }
};

const addStory = async (initialcost, relativeestimate, statement) => {
    getDBInstance();
    const query = {
        text: `INSERT INTO user_story ( initial_estimated_cost, initial_relative_estimate, i_want_to_statement )
         VALUES ( ${initialcost}, ${relativeestimate}, '${statement}' )`
    };
    try {
        let results = await db.query(query);
        return results;
    } catch (err) {
        console.log(err);
    }
};

const getAllStories = async () => {
    getDBInstance();
    const query = {
        text: $`SELECT * FROM user_story`
    };
    try {
        let results = await db.query(query);
        return results;
    } catch (err) {
        console.log(err);
    }
};

const getSelectedStory = async storyid => {
    getDBInstance();
    const query = {
        text: $`SELECT * FROM user_story WHERE user_story_id = ${storyid}`
    };
    try {
        let results = await db.query(query);
        return results;
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    getDBInstance,
    getProjectInformation,
    addProjectInformation,
    getTeamMembers,
    addTeamMembers,
    getAllStories,
    addStory,
    getSelectedStory
};
