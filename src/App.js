import React, {useState} from 'react';
import Header from './components/header'
import {Route, Switch} from "react-router-dom";
import AgileBoard from './Pages/AgileBoard'
import Gant from './Pages/Gant'
import WorkHours from "./Pages/WorkHours";
import Login from './Pages/login'
import Timer from './Timer'
import mainContext, {GetCostomSetState, loadState, saveState} from './UserContext'

const App = () => {
    const [mainState, setMainState] = React.useState({
        isLoggedIn: false,
        serverName: '185.8.172.29:8084',
        token_id: '2875b029a6a87c9b3b7f04fd207a9b8386c78172',
        user_id: null,
        sideBar: false,
        agileBoard: {
            data: null
        },
        inProgress: [],
    });
    const [reload, setReload] = useState(true)
    const loadMainState = () => {
        if (reload) {
            setReload(false)
            const state = loadState();
            console.log(state)
            if (state !== undefined) setMainState({...mainState, ...state})
        }
    }

    const loadTimer = () => {
        let timer = new Timer()
        setInterval(function () {
            if (timer.isActive()) {
                console.log("active:" + timer.getActiveTime())
            }
            else if (timer.isIdle()) {
                console.log("idle:" + timer.getActiveTime())
            }
        }, 1000)
    }
    React.useEffect(loadMainState, [])
    React.useEffect(loadTimer, [])

    const Main = () => (
        <Header>
            <Switch>
                <Route exact path="/Board" component={AgileBoard}/>
                <Route exact path="/Gant" component={Gant}/>
                <Route exact path="/WorkHours" component={WorkHours}/>
            </Switch>
        </Header>
    );

    return (
        <mainContext.Provider value={{mainState, setMainState: GetCostomSetState(setMainState), orginal: setMainState}}>
            {mainState.isLoggedIn ? <Main/> : <Login/>}
        </mainContext.Provider>
    )
}

export default App;
