import React from 'react';
import './App.css';
import {BrowserRouter, Switch, Route} from "react-router-dom"
import Dashboard from "./Components/Views/Dashboard";
import Login from "./Components/Views/Login";
import InstructorProfile from "./Components/Views/InstructorProfile";
import MyClasses from "./Components/Views/MyClasses";
import NewClass from "./Components/Views/NewClass";
import MonthlyProgram from "./Components/Views/MonthlyProgram";
import Sales from "./Components/Views/Sales";
import ConfigInstructor from "./Components/Views/ConfigInstructor";
import ChooseUserType from "./Components/Views/ChooseUserType";
import Errores from "./Components/Atoms/Errores";
import { AuthContext } from "./Config/AuthContext";

const App = () => (
  <AuthContext>
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} exact />
        <Route path="/configuration-instructor" component={ConfigInstructor} exact />
        <Route path="/account-type" component={ChooseUserType} exact />
        <Route path="/" component={Dashboard} exact />
        <Route path="/instructor-profile" component={InstructorProfile} exact />
        <Route path="/misclases" component={MyClasses} exact />
        <Route path="/nuevaclase" component={NewClass} exact />
        <Route path="/monthly-program" component={MonthlyProgram} exact />
        <Route path="/sales" component={Sales} exact />
        <Route path="*" component={Error} />
      </Switch>
    </BrowserRouter>
  </AuthContext>
)

export default App;
