import React from 'react';

import clsx from 'clsx';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';


import SideBar from './sideBar'
import HeaderItems from './headerItems'
import { mainContext } from '../UserContext';

const Header = (props) => {

    const classes = useStyles();
    const theme = useTheme();
    const { mainState, setMainState } = React.useContext(mainContext);

    let open = mainState.SideBar;
    const setOpen = (open) =>{
        console.log(mainState)

        setMainState({
            ...mainState,
            SideBar : open
        })
    }

    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={clsx(classes.appBar, {
                                 [classes.appBarShift]: open,
                             })}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                        onClick={() => setOpen(true)}
                        color="inherit"
                        aria-label="open drawer"
                    >
                        <MenuIcon/>
                    </IconButton>
                    <div style={{height:"100%",width:"80%",minHeight:"50px",padding:"10px 0"}} className={"HeaderDraggable"}>
                        <Typography style={{width:"auto",float:"left"}} className={classes.title} variant="h6" noWrap>
                            Redmine Desktop
                        </Typography>
                    </div>
                    <div className={"HeaderDraggable "+classes.grow}/>
                    <HeaderItems style={{width:"40%"}} />
                    
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
                <div className={classes.drawerHeader}>
                    <IconButton onClick={() => setOpen(false)}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                    </IconButton>
                </div>
                <SideBar/>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                {props.children}
            </main>
        </div>
    );
}

const drawerWidth = 240;
export const headerHeight = 50;

const headerHeightPx = headerHeight + 'px';

const useStyles = makeStyles((theme) => ({
    root:{
        display: 'flex',
        height:'100%'
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    grow: {
        flexGrow: 1,
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        })
    },
    toolbar: {
        maxHeight: headerHeightPx,
        minHeight: headerHeightPx,
        background: "linear-gradient(to left, #89216B, #DA4453)"
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
        maxHeight: headerHeightPx,
        minHeight: headerHeightPx + '!important',
    },
    content: {
        flexGrow: 1,
        padding: 0,
        height: 'calc(100% - 50px)',
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    headerText: {
        fontSize: '17px',
        fontWeight: 'bold'
    },
}));


export default Header;