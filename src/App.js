import React from 'react';
import './App.css';
import {BrowserRouter, Switch, Route} from "react-router-dom"
import Dashboard from "./Components/Views/Dashboard";
import Login from "./Components/Views/Login";
import ConfigInstructor from "./Components/Views/ConfigInstructor";
import Errores from "./Components/Atoms/Errores";
import { AuthContext } from "./Config/AuthContext";

const App = () => (
  <AuthContext>
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} exact />
        <Route path="/configuration-instructor" component={ConfigInstructor} exact />
        <Route path="/" component={Dashboard} exact />
        <Route path="*" component={Error} />
      </Switch>
    </BrowserRouter>
  </AuthContext>
)

export default App;
