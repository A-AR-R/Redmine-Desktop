import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { mainContext } from '../UserContext';
import axios from 'axios';
import { Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Modal, Select, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';

const WorkHours = () => {
    const classes = useStyles();
    const { mainState, setMainState } = React.useContext(mainContext);
    const { issueLogTimes } = mainState
    const [issueList, setIssueList] = useState([])
    const [modal, setModal] = useState({ open: false });
    const [activities, setActivities] = useState([]);

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
        }).then(({ data }) => {
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
        }).then(({ data }) => {
            setActivities(data.time_entry_activities.filter(c => c.active))
        })
    }, [])

    const submit = () => {
        for (const issue of issueLogTimes) {
            const dirtyLogs = issue.logTime.filter(c => c.id === -1);
            for (const log of dirtyLogs) {
                const formData = new FormData();
                formData.append('issue_id', issue.id);
                formData.append('user_id', mainState.user_id);
                console.warn(log.activityId);
                formData.append('activity_id', log.activityId);
                formData.append('time_entry[hours]', log.hours);
                axios({
                    method: 'post',
                    url: 'http://' + mainState.serverName + '/time_entries.json',
                    data: formData,
                    responseType: 'json',
                    dataType: 'json',
                    headers: {
                        'X-Redmine-API-Key': mainState.token_id,
                    }
                }).then(res => {
                    console.warn('sucsees')
                }).catch(res => {
                    console.error('errorrr')
                })
            }
            issue.logTime = issue.logTime.filter(c => c.id !== -1)
        }
        setMainState({ ...mainState })
    }
    const reset = () => {
        issueLogTimes.forEach(c => {
            c.logTime = c.logTime.filter(c => c.id !== -1)
        });
        setMainState({ ...mainState });
    }

    return (
        <div className={classes.container}>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead style={{ backgroundColor: '#87b7ff' }}>
                        <TableRow>
                            <TableCell />
                            <TableCell align="left">Issue Subject</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Estimated Hours</TableCell>
                            <TableCell align="center">Set Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {issueList.map((row) => (
                            <Row key={row.id} row={row} setModal={setModal} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={classes.buttons}>
                <Button onClick={reset} >Reset</Button>
                <Button onClick={submit} >Submit</Button>
            </div>
            <SetTimeModal modal={modal} setModal={setModal} activities={activities} issueList={issueList} state={{ mainState, setMainState }} />

        </div>
    )
}


const Row = ({ row, setModal }) => {
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
    return (
        <React.Fragment>
            <TableRow className={classes.root} >
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">{row.issueSubject}</TableCell>
                <TableCell align="center">{row.status.name}</TableCell>
                <TableCell align="center">{row.estimatedHours}</TableCell>
                <TableCell align="center">
                    <Button onClick={() => { setModal({ open: true, issueId: row.id }) }} >Add</Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Log
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead style={{ backgroundColor: '#87b7ff' }}>
                                    <TableRow>
                                        <TableCell>Activity</TableCell>
                                        <TableCell>Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.logTime.map((c, i) => (
                                        <TableRow key={i} className={c.id === -1 ? classes.dirtyLog : null} >
                                            <TableCell component="th" scope="row">
                                                {c.activity}
                                            </TableCell>
                                            <TableCell>{c.hours}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

const SetTimeModal = ({ modal, setModal, activities, issueList, state }) => {
    const { mainState, setMainState } = state
    const classes = useStyles();

    const [form, setForm] = React.useState({
        activityId: 0,
        hour: 0
    })
    React.useEffect(() => {
        setForm({
            ...form,
            activityId: activities.length === 0 ? '' : activities[0].id
        })
    }, [activities])

    const add = () => {
        let issue = issueList.filter(c => c.id === modal.issueId)[0]
        issue.logTime = [{
            id: -1,
            activityId: form.activityId,
            activity: activities.filter(n => n.id === form.activityId)[0].name,
            hours: Number(form.hour)
        }, ...issue.logTime]
        mainState.issueLogTimes = issueList
        setMainState(mainState)
        setModal({ open: false })
    }
    return (
        <Dialog open={modal.open} onClose={() => { setModal({ open: false }) }}>
            <DialogTitle> Add log time</DialogTitle >
            <DialogContent >
                <div className={classes.setTime}>
                    <TextField
                        className={classes.formControl}
                        style={{
                            width: '80px'
                        }}
                        label="Hours"
                        value={form.hour}
                        onChange={(event) => { setForm({ ...form, hour: event.target.value }); }}
                    />
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">Activity</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            label="Age"
                            value={form.activityId}
                            onChange={(event) => { setForm({ ...form, activityId: event.target.value }); }}
                        >
                            {activities.length === 0 ?
                                (<MenuItem value={form.activityId}>....</MenuItem>)
                                : activities.map((c, i) => (
                                    <MenuItem key={i} value={c.id}>{c.name}</MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </div>
            </DialogContent >
            <DialogActions>
                <Button onClick={add}>Add</Button>
            </DialogActions>
        </Dialog>
    );
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
        display: 'flex',
        justifyContent: 'space-around'
    },
    dirtyLog: {
        backgroundColor: 'aqua'
    }
}))

export default WorkHours
