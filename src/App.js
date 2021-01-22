import React from 'react';
import './App.css';
import Header from './components/header'
import {Route, Switch} from "react-router-dom";

import AgileBoard from './Pages/AgileBoard'
import Gant from './Pages/Gant'
import WorkHours from "./Pages/WorkHours";

const App = () => {
    return (
        <div className="App">
            <Header>
                <Switch>
                    <Route exact path="/Board" component={AgileBoard}/>
                    <Route exact path="/Gant" component={Gant}/>
                    <Route exact path="/WorkHours" component={WorkHours}/>
                </Switch>
            </Header>
        </div>
    );
}

export default App;
