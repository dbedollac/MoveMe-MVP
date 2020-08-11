import React from 'react';
import './App.css';
import {BrowserRouter, Switch, Route} from "react-router-dom"
import Dashboard from "./Components/Views/Dashboard";
import InstructorProfile from "./Components/Views/InstructorProfile";
import MyClasses from "./Components/Views/MyClasses";
import MonthlyProgram from "./Components/Views/MonthlyProgram";
import Sales from "./Components/Views/Sales";
import ConfigInstructor from "./Components/Views/ConfigInstructor";
import ChooseUserType from "./Components/Views/ChooseUserType";
import MarketPlace from './Components/Views/MarketPlace'
import Coach from './Components/Views/Coach'
import ClasesZoom from './Components/Views/ClasesZoom'
import MisVideos from './Components/Views/MisVideos'
import Carrito from './Components/Views/Carrito'
import MisCompras from './Components/Views/MisCompras'
import { AuthContext } from "./Config/AuthContext";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {stripePublicKey} from "./Config/StripeCredentials"

const stripePromise = loadStripe(stripePublicKey);

const App = () => (
  <Elements stripe={stripePromise}>
    <AuthContext>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Dashboard} exact />
          <Route path="/market" component={MarketPlace} exact />
          <Route path="/configuration-instructor" component={ConfigInstructor} exact />
          <Route path="/account-type" component={ChooseUserType} exact />
          <Route path="/instructor-profile" component={InstructorProfile} exact />
          <Route path="/misclases" component={MyClasses} exact />
          <Route path="/monthly-program" component={MonthlyProgram} exact />
          <Route path="/sales" component={Sales} exact />
          <Route path="/clasesZoom" component={ClasesZoom} exact />
          <Route path="/misVideos" component={MisVideos} exact />
          <Route path="/carrito" component={Carrito} exact />
          <Route path="/misCompras" component={MisCompras} exact />
          <Route path="/:name/:uid" component={Coach} exact />
          <Route path="*" component={Error} />
        </Switch>
      </BrowserRouter>
    </AuthContext>
  </Elements>
)

export default App;
