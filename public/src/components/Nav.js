import React, {useState, useEffect} from "react";
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
import NewProjectModal from "./AddNewProjectModal";
import Sprints from "./Sprints";

const drawerWidth = 240;



export default function PersistentDrawerLeft() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [projectsArr, setProjectsArr] = React.useState([]);
    const [mode, setMode] = React.useState("Team Member");
    const [dropdownState, setDropdownState] = useState({});



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
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleModeChange = ev => {
        setMode(ev.target.innerText);
        setAnchorEl(null);
    };

    const handleExpand = ev => {
        let currentId = ev.currentTarget.id;
        if(dropdownState[currentId] != null){
            setDropdownState({[currentId]: !dropdownState[currentId]});
        }
        else{
            setDropdownState({[currentId]: true});
        }
    };

    useEffect(() => {
        fetchProjects();
        console.log(projectsArr);
    }, []);

    //get the stories for the sprint parent (id passed through props)
    const fetchProjects = async () => {
        try {
            let response = await fetch(`http://localhost:5000/api/projectinformationwithsprints`);
            let json = await response.json();
            console.log(json);
            setProjectsArr(json?.rows);
            console.log('here');
        } catch (error) {
            alert("failed to process the request: " + error.toString());
            console.log(error);
        }
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open
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
                                textTransform: "capitalize"
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
                    paper: classes.drawerPaper
                }}
            >
                <div className={classes.drawerHeader + " drawerHead"}>
                    <h4
                        style={{
                            display: "flex",
                            justifyContent: "flex-start"
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
                            onClick={(ev) => handleExpand(ev)}
                        >
                            <ListItemIcon>
                                <AccountTreeIcon />
                            </ListItemIcon>
                            <ListItemText primary={proj.product_name} />
                            {dropdownState[proj.project_information_id] ? 
                                (<ExpandMore />) : (<ChevronRightIcon />)
                            }
                        </ListItem>
                        <Collapse
                            component="li"
                            in={dropdownState[proj.project_information_id]}
                            timeout="auto"
                            unmountOnExit
                        >
                            <List>
                                <ListItem>

                                    <ListItemText>test44</ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>test78</ListItemText>
                                </ListItem>

                                {proj?.sprintsdata?.map((spr, innerKeyIndex) =>
                                    <ListItem key={innerKeyIndex}>
                                        <ListItemText>{spr.is_initial_backlog_sprint ? "Product Backlog" : `Sprint ${keyIndex}`}test333545</ListItemText>
                                    </ListItem>
                                )}
                            </List>
                        </Collapse>
                    </div>
                ))}

                {/*

                
                    <ListItem 
                        button
                        id="1"
                        onClick={(ev) => handleExpand(ev)}
                    >
                        <ListItemIcon>
                            <AccountTreeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Project 1" />
                        {dropdownState['1'] ? 
                            (<ExpandMore />) : (<ChevronRightIcon />)
                        }
                    </ListItem>
                    <Collapse
                        component="li"
                        in={dropdownState['1']}
                        timeout="auto"
                        unmountOnExit
                    >
                        <List>
                            <ListItem>
                                <ListItemText primary="test123"/>
                            </ListItem>
                        </List>
                    </Collapse>
                    */}


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
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    appBar: {
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    hide: {
        display: "none"
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: "flex-end"
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginLeft: -drawerWidth
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0
    }
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
