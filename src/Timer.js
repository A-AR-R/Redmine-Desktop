import {Component} from "react";
import AgileBoard from "./Pages/AgileBoard";

const electron = window.require('electron');
const remote = electron.remote
const {BrowserWindow, dialog, Menu} = remote

const idle_period = 30 * 1

class Timer extends Component {
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

    getActiveTime(){
        return this.start_of_time
    }

    constructor(props) {
        super(props);
        let self = this;
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
            } else if (self.active_time > idle_period) {
                self.is_active = true
                self.is_idle = false
                self.start_of_time = new Date()
            }
        }, 1000)

    }
}

export default Timer;