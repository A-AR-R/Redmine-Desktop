import React from 'react';
import './App.css';
import Header from './components/header'
import { Route, Switch } from "react-router-dom";

import Home, { Home2 } from './Pages/home'

const App = () => {
  return (
    <div className="App">
      <Header >
        <Switch>
          <Route exact path="/home" component={Home} />
          <Route exact path="/home2" component={Home2} />
        </Switch>
      </Header>
    </div>
  );
}

export default App;
