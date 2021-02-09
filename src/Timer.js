import React, {Component, useContext, useEffect, useState} from 'react';
import Drawer from 'react-drag-drawer'
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import clsx from "clsx";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {useForm} from "react-hook-form";
import mainContext, {timerContext, loadState} from "./UserContext";
import DialogActions from "@material-ui/core/DialogActions";
import axios from "axios";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import TimerIcon from "@material-ui/icons/Timer";
import TimerOffIcon from "@material-ui/icons/TimerOff";

const electron = window.require('electron');
const remote = electron.remote
const {BrowserWindow, dialog, Tray } = remote
const app = remote.app
var curWindow=null;
app.whenReady().then(() => {
    curWindow = remote.getCurrentWindow();
})


const active_period = 15 * 1
const delay_for_prompt = 15 * 1

const PopUp = (props) => {
    const {mainState, setMainState} = React.useContext(mainContext);
    const {issueLogTimes} = mainState
    const classes = useStyles();
    const {register, handleSubmit, errors} = useForm();
    const [issueList, setIssueList] = useState([])
    const [modal, setModal] = useState({open: true});
    const [activities, setActivities] = useState([]);

    const [form, setForm] = React.useState({
        issueId: 0,
        activityId: 0,
        hour: 0
    })
    useEffect(() => {
        let list;
        axios({
            method: 'get',
            url: 'http://' + mainState.serverName + '/issues.json',
            params: {
                assigned_to_id: mainState.user_id
            },
            responseType: 'json',
            dataType: 'json',
            headers: {
                "Access-Control-Allow-Headers": "X-Requested-With",
                'X-Redmine-API-Key': mainState.token_id,
                'Access-Control-Allow-Origin': '*'
            }
        }).then(res => {
            list = res.data.issues.map(c => ({
                id: c.id,
                subject: c.subject,
                issueSubject: c.subject,
                status: c.status,
                estimatedHours: c.estimated_hours,
                logTime: []
            })).sort((a, b) => a.status.id - b.status.id);
        }).then(() => {
            return axios({
                method: 'get',
                url: 'http://' + mainState.serverName + '/time_entries.json',
                params: {
                    user_id: mainState.user_id
                },
                responseType: 'json',
                dataType: 'json',
                headers: {
                    "Access-Control-Allow-Headers": "X-Requested-With",
                    'X-Redmine-API-Key': mainState.token_id,
                    'Access-Control-Allow-Origin': '*'
                }
            })
        }).then(({data}) => {
            const newState = list.map(c => ({
                ...c,
                logTime: data.time_entries.filter(n => n.issue.id === c.id).map(n => ({
                    id: n.id,
                    activity: n.activity.name,
                    activityId: n.activity.id,
                    hours: n.hours
                }))
            }))
            for (let issue of newState) {
                console.log(1, issue.logTime)
                if (issueLogTimes.some(c => c.id === issue.id)) {
                    const dirtyLogs = issueLogTimes.filter(c => c.id === issue.id)[0].logTime.filter(c => c.id === -1);
                    issue.logTime = [...issue.logTime, ...dirtyLogs]
                }
                console.log(2, issue.logTime)
            }
            setIssueList(newState)
        })
        axios({
            method: 'get',
            url: 'http://' + mainState.serverName + '/enumerations/time_entry_activities.json',
            responseType: 'json',
            dataType: 'json',
            headers: {
                "Access-Control-Allow-Headers": "X-Requested-With",
                'X-Redmine-API-Key': mainState.token_id,
                'Access-Control-Allow-Origin': '*'
            }
        }).then(({data}) => {
            console.log(data)
            setActivities(data.time_entry_activities.filter(c => c.active))
            console.log(activities)
        })

    }, [])

    React.useEffect(() => {
        setForm({
            ...form,
            activityId: activities.length === 0 ? '' : activities[0].id,
            issueId: issueList.length === 0 ? '' : issueList[0].id
        })
    }, [activities,issueList])

    return (
        <Dialog open={props.showPopup} onClose={props.handleClose}>
            {
                props.status ? <div>
                    <DialogTitle> Stop Timer</DialogTitle>
                    <DialogContent>
                        <div className={classes.setTime}>
                            <FormControl disabled style={{width: "100%"}} variant="outlined" className={classes.formControl}>
                                <InputLabel id="demo-simple-select-outlined-label">Activity</InputLabel>
                                <Select value={form.issueId} onChange={(event) => {
                                    setForm({...form, issueId: event.target.value});
                                }}>
                                    {issueList.length === 0 ?
                                        (<MenuItem value={form.activityId}>....</MenuItem>)
                                        : issueList.map((c, i) => (
                                            <MenuItem key={i} value={c.id}>{c.subject}</MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <FormControl disabled style={{width: "100%"}} variant="outlined" className={classes.formControl}>
                                <Select value={form.activityId} onChange={(event) => {
                                    setForm({...form, activityId: event.target.value});
                                }}>
                                    {activities.length === 0 ?
                                        (<MenuItem value={form.activityId}>....</MenuItem>)
                                        : activities.map((c, i) => (
                                            <MenuItem key={i} value={c.id}>{c.name}</MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <FormControl disabled style={{width: "100%"}} variant="outlined" className={classes.formControl}>
                                <Input value={props.time}></Input>
                            </FormControl>
                        </div>
                    </DialogContent>
                    <DialogActions>
                    <Button style={{margin: "0.5rem"}} onClick={() => {
                        props.stopTimer();
                        let issue = issueList.filter(c => c.id === form.issueId)[0]
                        issue.logTime = [{
                            id: -1,
                            activityId: form.activityId,
                            activity: activities.filter(n => n.id === form.activityId)[0].name,
                            hours: Number(props.time)
                        }, ...issue.logTime]
                        props.handleClose();
                        setMainState({...mainState,issueLogTimes:issueList})
                    }}>Stop Timer</Button>
                        <Button style={{margin: "0.5rem"}} onClick={() => {
                            props.stopTimer();
                            props.handleClose();
                            setMainState({...mainState})
                        }}>Remove Timer</Button>
                        </DialogActions>
                </div> : (
                    <div>
                        <DialogTitle> Add New Timer</DialogTitle>
                        <DialogContent>
                            <div className={classes.setTime}>
                                <FormControl style={{width: "100%"}} variant="outlined" className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-outlined-label">Activity</InputLabel>
                                    <Select value={form.issueId} onChange={(event) => {
                                        setForm({...form, issueId: event.target.value});
                                    }}>
                                        {issueList.length === 0 ?
                                            (<MenuItem value={form.activityId}>....</MenuItem>)
                                            : issueList.map((c, i) => (
                                                <MenuItem key={i} value={c.id}>{c.subject}</MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <FormControl style={{width: "100%"}} variant="outlined" className={classes.formControl}>
                                    <Select value={form.activityId} onChange={(event) => {
                                        setForm({...form, activityId: event.target.value});
                                    }}>
                                        {activities.length === 0 ?
                                            (<MenuItem value={form.activityId}>....</MenuItem>)
                                            : activities.map((c, i) => (
                                                <MenuItem key={i} value={c.id}>{c.name}</MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                props.handleStart();
                            }}>Start Timer</Button>
                        </DialogActions>
                    </div>
                )
            }

        </Dialog>
    )
}

class TaskTimer extends Component {
    is_active = false
    active_time = 0;
    idle = 0
    state = {
        issueID: 0,
        activityID: 0,
        time: 0,
        isOn: false,
        start: 0,
        showPopup: false,
        last_prompt_time: new Date()
    };

    constructor(props) {
        super(props)
        this.state = {
            issueID: 0,
            activityID: 0,
            time: 0,
            isOn: false,
            start: 0,
            showPopup: false,
            last_prompt_time: new Date()
        }
        this.startTimer = this.startTimer.bind(this)
        this.stopTimer = this.stopTimer.bind(this)
        this.OpenStopTimer = this.OpenStopTimer.bind(this)
        this.handleStart = this.handleStart.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    startTimer() {
        this.setState({
            ...this.state,
            isOn: true,
            start: new Date(),
            showPopup: false
        })
    }

    OpenStopTimer() {
        this.setState({
            ...this.state,
            showPopup: true,
            hour: ((new Date() - this.state.start)/(10*3600)).toFixed(5)
        })
    }

    stopTimer() {
        this.setState({
            ...this.state,
            showPopup: true,
            isOn: false,
            start: 0,
            hour: ((new Date() - this.state.start)/(10*3600)).toFixed(5)
        })
    }

    isActive() {
        return this.is_active
    }

    handleStart() {
        this.setState({
            ...this.state, showPopup: false
            , start: new Date()
        });

    }

    handleClose() {
        this.setState({
            ...this.state, showPopup: false,
        });
    }

    componentDidMount() {
        var self = this;
        this.handleClose = this.handleClose.bind(this);
        this.handleStart = this.handleStart.bind(this);

        // console.log(this.context.mainState);
        //
        if (this.state.start) {
            this.setState({...this.state, start: 0})
        }

        setInterval(function () {
            self.idle = remote.powerMonitor.getSystemIdleTime()
            if (self.idle < 10) {
                self.active_time += 1
            } else if(self.idle>10){
                self.active_time = 0
            }
            if (self.active_time > active_period && self.state.start===0 && (new Date() - self.state.last_prompt_time)/1000 >= delay_for_prompt) {
                self.is_active = true
                self.is_idle = false
                self.setState({
                    ...self.state,
                    showPopup: true,
                    last_prompt_time:new Date()
                })
                curWindow.show()
                curWindow.setVisibleOnAllWorkspaces(true)
            }
        }, 1000)
    };

    render() {
        return (
            <div>
                {
                    this.state.isOn ? (<IconButton
                        edge="end"
                        aria-label="account of current user"
                        aria-haspopup="true"
                        color="inherit"
                        onClick={this.OpenStopTimer}>
                        <TimerOffIcon/>
                    </IconButton>) : (<IconButton
                        edge="end"
                        aria-label="account of current user"
                        aria-haspopup="true"
                        color="inherit"
                        onClick={() => {
                            this.setState({...this.state, showPopup: true})
                        }
                        }>
                        <TimerIcon/>
                    </IconButton>)

                }

                <PopUp handleStart={this.startTimer} handleClose={this.handleClose} stopTimer={this.stopTimer}
                       showPopup={this.state.showPopup}
                       status={this.state.isOn}
                       time={this.state.hour}/>
            </div>
        )
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#e5e5e5",
        '& > *': {
            borderBottom: 'unset',
        },
    },
    buttons: {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '20px',
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        flexDirection: 'column'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    setTime: {
        // display: 'flex',
        justifyContent: 'space-around'
    },
    dirtyLog: {
        backgroundColor: 'aqua'
    }
}))

export default TaskTimer;