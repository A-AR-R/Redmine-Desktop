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
import mainContext, {timerContext, loadState, GetCustomSetState} from "./UserContext";
import DialogActions from "@material-ui/core/DialogActions";
import axios from "axios";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import TimerIcon from "@material-ui/icons/Timer";
import TimerOffIcon from "@material-ui/icons/TimerOff";
import main from "material-ui-rte/src/themes/main";

const electron = window.require('electron');
const remote = electron.remote
const {BrowserWindow, dialog, Tray, Notification} = remote


const app = remote.app
let curWindow = null;

app.whenReady().then(() => {
    curWindow = remote.getCurrentWindow();
})


class NotifyNewTask extends Component {
    static contextType = mainContext
    number_of_tasks = 1
    first_time = true

    constructor(props) {
        super(props)
        this.state = {
            changed: false
        }
        this.update_number_of_tasks = this.update_number_of_tasks.bind(this)
    }

    update_number_of_tasks() {
        var self = this;
        // 2875b029a6a87c9b3b7f04fd207a9b8386c78172
        axios({
            method: 'get',
            url: 'http://' + this.context.mainState.serverName + '/issues.json',
            params: {
                assigned_to_id: this.context.mainState.user_id
            },
            responseType: 'json',
            dataType: 'json',
            headers: {
                "Access-Control-Allow-Headers": "X-Requested-With",
                'X-Redmine-API-Key': this.context.mainState.token_id,
                'Access-Control-Allow-Origin': '*'
            }
        }).then(res => {
                if (self.first_time) {
                    self.number_of_tasks = res.data.issues.length
                    self.first_time = false
                }
                if (self.number_of_tasks !== res.data.issues.length) {
                    self.number_of_tasks = res.data.issues.length
                    const notification = {
                        title: 'TASKS',
                        body: "You have " + self.number_of_tasks + " tasks"
                    }
                    new Notification(notification).show()
                }
            }
        )
    }

    componentDidMount() {
        var self = this;

        setInterval(function () {
            self.update_number_of_tasks()
        }, 5000)
    };

    render() {
        return (
            <div>
                {
                    <IconButton disabled color="inherit">
                        {
                            <Badge badgeContent={0} color="secondary">
                                <NotificationsIcon/>
                            </Badge>
                        }
                    </IconButton>
                }
            </div>
        )
    }
}


export default NotifyNewTask;