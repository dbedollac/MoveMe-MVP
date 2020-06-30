import React from 'react';
import './SignIn.css';
import {db} from "../../Config/firestore.js"
import Header from "../Molecules/Header.js"

class SignIn extends React.Component {
  constructor() {
    super()
  }

  render(){
    return (
      <div>
        <Header type={1}/>
      </div>
    )
  }
}

export default SignIn
