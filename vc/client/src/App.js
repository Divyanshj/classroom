import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from './components/Main/Main';
import Room from './components/Room/Room'

function App() {
  return (
    <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/room/:roomID" component={Room} />
        </Switch>
    </BrowserRouter>
  );
}


export default App;
