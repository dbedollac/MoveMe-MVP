import React from 'react';
import './App.css';
import {db} from "./Config/firestore.js"
import {BrowserRouter, Switch, Route} from "react-router-dom"
import SignIn from "./Components/Views/SignIn.js"

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" component={SignIn} exact />
    </Switch>
  </BrowserRouter>
)

export default App;
