import React from "react";
import './ChooseUserType.css'
import Header from "../Molecules/Header";
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import {Redirect} from "react-router-dom";
import {db} from '../../Config/firestore'
import logo from './Images/logo.jpg'

class ChooseUserType extends React.Component {
  static contextType = Auth

  constructor(props) {
    super(props);
    this.state = {
      nombre: null,
      instructor: true,
      aceptar: false
    }

  }

  handleInstructorClick = () => {
    this.setState(
      {instructor: true})
  }

  handleUserClick = () => {
    this.setState(
      {instructor: false})
  }

  handleAceptar = () =>{
    let user = this.context.usuario;
    this.setState({aceptar: true})
    if (this.state.instructor) {

    db.collection("Instructors").add({
    email: user.email,
    uid: user.uid,
    CLABE: "",
    noTarjeta: "",
    profilePicture:"",
    selfDescription:"",
    trialClasses: true,
    website: "",
    zoomToken: ""
    });

        } else {
              db.collection("Users").add({
              email: user.email,
              uid: user.uid
              })
            }
          }

  componentDidMount(){
    let user = this.context.usuario;
    user?user.displayName?this.setState({nombre: user.displayName}):this.setState({nombre: user.email}):this.setState({nombre: null})
  }


  render(){
    if (this.state.aceptar) {
      if (this.state.instructor) {
        return <Redirect to="/configuration-instructor"/>
      }
    }

    return(
      <div>
          <Header type={0} title='M O V E M E'/>
              <div className="col-12 chooseUserType-container d-flex flex-column justify-content-start align-items-center ">
                <div className="d-flex flex-column">
                  <h2>Hola {this.state.nombre} :)</h2>
                </div>
                <div className="pregunta text-center pt-2 col-8"><p>¿Cómo quieres utilizar MoveMe?</p></div>
                  <div className="d-flex flex-column align-items-center">
                    <div className="d-flex flex-row col-12 justify-content-between">
                      <div className="d-flex flex-column m-1 align-items-center col-6 options text-center"
                        onClick={this.handleInstructorClick}
                        style={{backgroundColor: this.state.instructor ? '#F39119' : 'white'}}>
                        <img src='./Instructor.png' alt='Instructor'/>
                        <p> ¡Quiero ofrecer ofrecer mis servicios fitness! </p>
                      </div>
                      <div className="d-flex flex-column m-1 align-items-center col-6 options text-center"
                        onClick={this.handleUserClick}
                        style={{backgroundColor: this.state.instructor? 'white' : '#F39119'}}>
                        <img src='./User.png' alt='Instructor'/>
                        <p> ¡Quiero hacer ejercicio! </p>
                      </div>
                    </div>
                  </div>
                  <button className="btn-primary col-3" onClick={this.handleAceptar}>Aceptar</button>
              </div>
      </div>
    )
  }
}

export default ChooseUserType;
