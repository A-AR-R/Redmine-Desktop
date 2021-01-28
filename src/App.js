import React from 'react';
import Header from './components/header'
import { Route, Switch } from "react-router-dom";
import AgileBoard from './Pages/AgileBoard'
import Gant from './Pages/Gant'
import WorkHours from "./Pages/WorkHours";
import Login from './Pages/login'
import mainContext from './UserContext'
// export const mainContext = React.createContext();

const App = () => {
    const [mainState, setMainState] = React.useState({
        isLoggedIn: false,
        serverName: '185.8.172.29:8084',
        token_id: '2875b029a6a87c9b3b7f04fd207a9b8386c78172'
    });

    const Main = () => (
        <Header>
            <Switch>
                <Route exact path="/Board" component={AgileBoard} />
                <Route exact path="/Gant" component={Gant} />
                <Route exact path="/WorkHours" component={WorkHours} />
            </Switch>
        </Header>
    );

    return (
        <mainContext.Provider value={{ mainState, setMainState }}>
            {mainState.isLoggedIn ? <Main /> : <Login />}
        </mainContext.Provider>
    )
}

export default App;
