import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Menu, MenuItem } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import { StarBorder } from "@material-ui/icons";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import theme from "../theme";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import NewProjectModal from "./AddNewProjectModal";
import NewSprintModal from "./AddNewSprintModal";

const drawerWidth = 240;

const PersistentDrawerLeft = (props) => {
    //destructure props
    const { sendToMainDisplay, projDisplayMain } = props;

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [openSprintModal, setOpenSprintModal] = React.useState(false);
    const [projectsArr, setProjectsArr] = React.useState([]);
    const [currentProjId, setCurrentProjId] = useState(-1);
    const [mode, setMode] = React.useState("Team Member");
    const [dropdownState, setDropdownState] = useState({});
    const [currentTeamMembers, setCurrentTeamMembers] = React.useState([]);
    const [displayTeammembers, setDisplayTeammembers] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleNewProject = () => {
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
        //refresh to show the new proj
        fetchProjects();
    };

    const handleNewSprint = () => {
        setOpenSprintModal(true);
    };

    const handleSprintModalClose = () => {
        setOpenSprintModal(false);
        //refresh to show the new sprint
        fetchProjects();
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleModeChange = (ev) => {
        setMode(ev.target.innerText);
        setAnchorEl(null);
    };

    const handleExpand = (ev, projdata) => {
        let currentId = ev.currentTarget.id;
        //on click flip the dropdown state between open and closed
        if (dropdownState[currentId] != null) {
            setDropdownState({ [currentId]: !dropdownState[currentId] });
        } else {
            setDropdownState({ [currentId]: true });
        }
        //update proj id
        if(currentProjId != currentId){
            setCurrentProjId(currentId);
            //update main display
            let product_name = ev.currentTarget?.getAttribute("product_name");
            let team_name = ev.currentTarget?.getAttribute("team_name");
            let project_start_date = ev.currentTarget?.getAttribute("project_start_date");
            let hours_per_storypoint = ev.currentTarget?.getAttribute("hours_per_storypoint");
            let total_estimated_storypoints = ev.currentTarget?.getAttribute("total_estimated_storypoints");
            let total_estimated_cost = ev.currentTarget?.getAttribute("total_estimated_cost");

            projDisplayMain({
                id: currentId,
                productname: product_name,
                teamname: team_name,
                projectstartdate: project_start_date,
                hoursperstorypoint: hours_per_storypoint,
                totalestimatedstorypoints: total_estimated_storypoints,
                totalestimatedcost: total_estimated_cost
            });
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    //get the stories for the sprint parent (id passed through props)
    const fetchProjects = async () => {
        try {
            let response = await fetch(
                `http://localhost:5000/api/projectinformationwithsprints`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );
            let json = await response.json();
            setProjectsArr(json?.rows);
        } catch (error) {
            alert(
                "failed to process the fetchProjects request: " +
                    error.toString()
            );
            console.log(error);
        }
    };

    const fetchTeamMembersForProject = async () => {
        try {
            let response = await fetch(
                `http://localhost:5000/api/teammembersforproject/${currentProjId}`
            );
            let json = await response.json();
            setCurrentTeamMembers(json?.rows);
            console.log(json?.rows);
        } catch (error) {
            alert(
                "failed to process the fetchTeamMembers request: " +
                    error.toString()
            );
            console.log(error);
        }
    };

    const handleSprintListClick = (ev) => {
        let clickedId = ev.currentTarget?.getAttribute("sprintid");
        console.log(clickedId);
        sendToMainDisplay(clickedId);
    };

    const handleShowTeammembers = async () => {
        fetchTeamMembersForProject();
        if(!displayTeammembers)
        {
            setDisplayTeammembers(true);
        }
        
    };
    

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar style={{ paddingRight: 0 }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(
                            classes.menuButton,
                            open && classes.hide
                        )}
                        style={{ marginRight: 0 }}
                    >
                        <MenuIcon />
                        <Typography
                            variant="h6"
                            style={{ position: "absolute", left: 45 }}
                            noWrap
                        >
                            Projects
                        </Typography>
                    </IconButton>
                    <Typography variant="h6" style={{ marginLeft: 20 }} noWrap>
                        SprintCompass
                    </Typography>
                    <Button
                        color="inherit"
                        style={{ boxSizing: "border-box", padding: 0 }}
                    >
                        <Typography
                            variant="h6"
                            style={{
                                position: "absolute",
                                right: 50,
                                textTransform: "capitalize",
                            }}
                            noWrap
                        >
                            {mode}
                        </Typography>
                        <AccountCircleIcon
                            aria-controls="user-menu"
                            aria-haspopup="true"
                            onClick={handleClick}
                        />{" "}
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader + " drawerHead"}>
                    <h4
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                        }}
                    >
                        Projects
                    </h4>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "ltr" ? (
                            <ChevronLeftIcon />
                        ) : (
                            <ChevronRightIcon />
                        )}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {projectsArr?.map((proj, keyIndex) => (
                        <div key={keyIndex}>
                            <ListItem
                                button
                                id={proj.project_information_id}
                                product_name={proj.product_name}
                                team_name={proj.team_name}
                                project_start_date={proj.project_start_date}
                                hours_per_storypoint={proj.hours_per_storypoint}
                                total_estimated_storypoints={proj.total_estimated_storypoints}
                                total_estimated_cost={proj.total_estimated_cost}
                                onClick={(ev) => handleExpand(ev)}
                            >
                                <ListItemIcon>
                                    <AccountTreeIcon />
                                </ListItemIcon>
                                <ListItemText primary={proj.product_name} />
                                {dropdownState[proj.project_information_id] ? (
                                    <ExpandMore />
                                ) : (
                                    <ChevronRightIcon />
                                )}
                            </ListItem>
                            <Collapse
                                component="li"
                                in={dropdownState[proj.project_information_id]}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List>
                                    <ListItem style={{backgroundColor: '#6B6'}} onClick={handleShowTeammembers}>
                                        <ListItemText>Team Members</ListItemText>
                                        {<Dialog
                                            onClose={() => setDisplayTeammembers(false)}
                                            open={displayTeammembers}
                                        >
                                        <List>
                                        <ListItem>
                                                <Typography style={{textAlign: 'center', fontWeight: 'bold', fontSize:20 }}>Team Members</Typography>
                                        </ListItem>
                                        {currentTeamMembers?.map((mem, keyVal) => ( 
                                            <ListItem key={keyVal}>
                                                <ListItemText style={{textAlign: 'center'}}>{mem?.first_name}{" "}{mem?.last_name}</ListItemText>
                                            </ListItem>
                                        ))}
                                        </List>
                                        <Button onClick={() => setDisplayTeammembers(false)} style={{color: 'red'}}>Close</Button>
                                        </Dialog>
                                        }
                                    </ListItem>
                                    {proj?.sprintsdata?.map(
                                        (spr, innerKeyIndex) => (
                                            <ListItem
                                                key={innerKeyIndex}
                                                onClick={handleSprintListClick}
                                                sprintid={spr.sprint_id}
                                            >
                                                <ListItemText>
                                                    {spr.is_initial_backlog_sprint
                                                        ? "Product Backlog"
                                                        : `Sprint ${spr.sprint_id}`}
                                                </ListItemText>
                                            </ListItem>
                                        )
                                    )}
                                    <Divider />
                                    <ListItem button onClick={handleNewSprint}>
                                        <ListItemIcon>
                                            <AddCircleIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Add Sprint" />
                                    </ListItem>
                                    <Divider />
                                </List>
                            </Collapse>
                        </div>
                    ))}

                    <Divider />
                    <ListItem button onClick={handleNewProject}>
                        <ListItemIcon>
                            <AddCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Add Project" />
                    </ListItem>
                    <Divider />
                </List>
            </Drawer>
            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleModeChange}
            >
                <MenuItem onClick={handleModeChange}>Team Member</MenuItem>
                <MenuItem onClick={handleModeChange}>Project Manager</MenuItem>
            </Menu>

            <NewProjectModal
                openModal={openModal}
                closeModal={handleModalClose}
            />
            {<NewSprintModal
                openModal={openSprintModal}
                closeModal={handleSprintModalClose}
                projId={currentProjId}
            />}
            
        </div>
    );
};

export default PersistentDrawerLeft;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: "none",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: "flex-end",
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));

/*import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    }
}));

export default function ButtonAppBar() {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleModeChange = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="menu"
                    onClick={handleClick}
                >
                    <MenuIcon
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                    />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    Sprint Compass
                </Typography>
                <Button color="inherit">
                    <AccountCircle />
                </Button>
            </Toolbar>

            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleModeChange}
            >
                <MenuItem onClick={handleModeChange}>Profile</MenuItem>
                <MenuItem onClick={handleModeChange}>My account</MenuItem>
                <MenuItem onClick={handleModeChange}>Logout</MenuItem>
            </Menu>
        </AppBar>
    );
}
*/
