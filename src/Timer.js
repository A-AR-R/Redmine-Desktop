import React, {Component} from 'react';
import Drawer from 'react-drag-drawer'
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import {Typography} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {useForm} from "react-hook-form";
import mainContext, {loadState} from "./UserContext";

const electron = window.require('electron');
const remote = electron.remote
const {BrowserWindow, dialog, Menu} = remote

const idle_period = 2 * 1


const PopUp = (props) => {
    const classes = useStyles();
    const {register, handleSubmit, errors} = useForm();

    return (
        <Drawer open={props.open}>
            <form className={classes.root}>
                <Paper className={clsx(classes.loginBox)}>
                    <Typography className={classes.title}>Your System is {props.status} for {props.time} but no timer is started would you like to active one?</Typography>
                    <Typography color={"error"} className={classes.error}>
                    </Typography>

                    <Button
                        className={classes.submit}
                        type="button">
                        start
                    </Button>
                </Paper>
            </form>
        </Drawer>
    )
}

class Timer extends Component {
    static contextType = mainContext

    is_idle = false
    is_active = false
    start_of_time = null;
    active_time = 0;
    idle = 0

    isIdle() {
        return this.is_idle
    }

    isActive() {
        return this.is_active
    }

    getActiveTime() {
        return this.start_of_time
    }

    constructor(props) {
        super(props);
        this.state = {
            showPopup: false
        }
        this.open_state = true


    }

    componentDidMount() {
        var self = this;
        const {mainState, setMainState}= this.context;
        console.log(mainState)
        setInterval(function () {
            self.idle = remote.powerMonitor.getSystemIdleTime()
            if (self.idle === 0) {
                self.active_time += 1
            } else {
                self.active_time = 0
            }
            if (self.idle > idle_period) {
                self.start_of_time = new Date()
                self.is_idle = true
                self.is_active = false
                self.setState({
                    showPopup: true
                })
            } else if (self.active_time > idle_period) {
                self.is_active = true
                self.is_idle = false
                self.start_of_time = new Date()
                self.setState({
                    showPopup: true
                })
            }
        }, 1000)
    };

    render() {
        return (
            <div>
                {this.state.showPopup ? <PopUp open={this.open_state} status={'active'} time={'10 minutes'}></PopUp> : null}
            </div>
        )
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: "center",
        flexDirection: "column",
        alignItems: 'center',
        height: `100vh`,
    },
    loginBox: {
        display: 'flex',
        justifyContent: "center",
        flexDirection: "column",
        alignItems: 'center',
        padding: '20px',
        '& > div': {
            margin: '5px',
            width: '250px'
        }
    },
    title: {
        fontSize: '30px',
        fontWeight: 'bold',
        paddingBottom: '10px'
    },
    submit: {
        marginTop: '10px'
    },
    error: {
        fontSize: '15px'
    }
}));
export default Timer;