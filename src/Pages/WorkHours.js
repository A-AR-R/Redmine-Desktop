import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import HotelIcon from '@material-ui/icons/Hotel';
import RepeatIcon from '@material-ui/icons/Repeat';
import Typography from '@material-ui/core/Typography';
import { mainContext } from '../UserContext';
import axios from 'axios';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Component } from 'react';

const WorkHours = () => {
    const { mainState, setMainState } = React.useContext(mainContext);
    const [state, setState] = useState([])
    console.log('ren', state)
    useEffect(() => {
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
            console.log(res.data)
            let list = res.data.issues.map(c => ({ id: c.id, subject: c.subject, status: c.status , estimated_hours:c.estimated_hours }))
                .filter(c => c.status.id === 2)
            for (let item of list) {
                if (mainState.inProgress.some(c => c.id === item.id)) {
                    item.time = mainState.inProgress.filter(c => c.id === item.id)[0].time
                } else {
                    item.time = 0
                }
            }
            setState(list)
        })
    }, [])

    const setTime = (id) => () => {
        const value = document.querySelector('#filled-helperText' + id).value;
        const newState = state.filter(c => c.id === id)[0]
        newState.time = newState.time + parseInt(value);
        setState([...state])
        setMainState({
            ...mainState,
            inProgress: state
        })
    }

    const submit = () => {
        const data = {
            'issue_id': state[0].id,
            'user_id':mainState.user_id,
            'hours':state[0].time,
        };
        console.log(data)
        axios({
            method: 'post',
            url: 'http://' +mainState.serverName + '/time_entries.json',
            data: data,
            responseType: 'json',
            dataType: 'json',
            headers: {
                'X-Redmine-API-Key': mainState.token_id,
            }

        }).then(res => {
            console.log('respo', res)

        })
    }

    return (
        <div style={{ padding: '20px' }}>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#95a5a5' }}>
                            <TableCell>Subject</TableCell>
                            <TableCell align="center">Estimated Hours</TableCell>
                            <TableCell align="center">Time</TableCell>
                            <TableCell align="center">Set Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.map(c => (
                            <TableRow key={c.id}>
                                <TableCell component="th" scope="row">
                                    {c.subject}
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    {c.estimated_hours}
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    {c.time}
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        defaultValue={'0'}
                                        id={"filled-helperText" + c.id}
                                        type="number"
                                        size='small'
                                        style={{
                                            width: '80px'
                                        }}
                                    />
                                    <Button size='small' style={{ margin: '5px' }} onClick={setTime(c.id)}>Set</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button style={{ margin: '20px' }} onClick={submit}>Submit</Button>
        </div>
    )
}

/*
return (
    <Timeline align="left" >
        <TimelineItem>
            <TimelineOppositeContent>
                <Typography variant="body2" color="textSecondary">
                    9:30 am
                </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineDot>
                    <FastfoodIcon />
                </TimelineDot>
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
                <Paper elevation={3} className={classes.paper}>
                    <Typography variant="h6" component="h1">
                        Eat
                    </Typography>
                    <Typography>Because you need strength</Typography>
                </Paper>
            </TimelineContent>
        </TimelineItem>
        <TimelineItem>
            <TimelineOppositeContent>
                <Typography variant="body2" color="textSecondary">
                    10:00 am
                </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineDot color="primary">
                    <LaptopMacIcon />
                </TimelineDot>
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
                <Paper elevation={3} className={classes.paper}>
                    <Typography variant="h6" component="h1">
                        Code
                    </Typography>
                    <Typography>Because it&apos;s awesome!</Typography>
                </Paper>
            </TimelineContent>
        </TimelineItem>
        <TimelineItem>
            <TimelineSeparator>
                <TimelineDot color="primary" variant="outlined">
                    <HotelIcon />
                </TimelineDot>
                <TimelineConnector className={classes.secondaryTail} />
            </TimelineSeparator>
            <TimelineContent>
                <Paper elevation={3} className={classes.paper}>
                    <Typography variant="h6" component="h1">
                        Sleep
                    </Typography>
                    <Typography>Because you need rest</Typography>
                </Paper>
            </TimelineContent>
        </TimelineItem>
        <TimelineItem>
            <TimelineSeparator>
                <TimelineDot color="secondary">
                    <RepeatIcon />
                </TimelineDot>
            </TimelineSeparator>
            <TimelineContent>
                <Paper elevation={3} className={classes.paper}>
                    <Typography variant="h6" component="h1">
                        Repeat
                    </Typography>
                    <Typography>Because this is the life you love!</Typography>
                </Paper>
            </TimelineContent>
        </TimelineItem>

    </Timeline>
);
 */

export default WorkHours
