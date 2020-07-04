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
      aceptar: false,
      newUser: true,
      newInstructor: true
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

  searchInstructor = () =>{
    let user = this.context.usuario;
    if(user){
    db.collection("Instructors").where("uid", "==", user.uid).get().then( (querySnapshot) => {
    querySnapshot.forEach((doc) => {
            this.setState({newInstructor: false})
          });
      });
  }
  }

  searchUser = () =>{
    let user = this.context.usuario;
    if (user) {
    db.collection("Users").where("uid", "==", user.uid).get().then( (querySnapshot) => {
    querySnapshot.forEach((doc) => {
            this.setState({newInstructor: false})
          });
      });
  }
  }

  handleAceptar = () =>{
    let user = this.context.usuario;
    this.setState({aceptar: true})
    if (this.state.instructor) {
      if (this.state.newInstructor) {
        db.collection("Instructors").doc(user.email).set({
        email: user.email,
        uid: user.uid,
        profileName: '',
        firstName: "",
        lastName: "",
        CLABE: "xxxxxxxxxxxxxxxxxx",
        noTarjeta: "xxxx xxxx xxxx xxxx",
        selfDescription:"",
        disableTrialClasses: false,
        website: "",
        zoomToken: "",
        zoomRefreshToken: ""
        });
      }
        } else {
            if (this.state.newUser) {
              db.collection("Users").doc(user.email).set({
              email: user.email,
              uid: user.uid
              })
            }
              }
            }

  componentDidMount(){
    let user = this.context.usuario;
    user?user.displayName?this.setState({nombre: user.displayName}):this.setState({nombre: user.email}):this.setState({nombre: null})
  this.searchInstructor()
  this.searchUser()
  }


  render(){
    if (this.state.aceptar) {
      if (this.state.instructor) {
        if (this.state.newInstructor) {
          return <Redirect to="/configuration-instructor"/>
        } else {
          return <Redirect to="/"/>
        }
      }
    }

    return(
      <div>
          <Header type={0} title='M O V E M E'/>
              <div className="col-12 chooseUserType-container d-flex flex-column justify-content-start align-items-center ">
                <div className="d-flex flex-column m-2">
                  <h2>Hola {this.state.nombre} :)</h2>
                </div>
                <div className="chooseUserType-pregunta text-center pt-2 col-8"><p>¿Cómo quieres utilizar MoveMe?</p></div>
                  <div className="d-flex flex-column align-items-center">
                    <div className="d-flex flex-row col-12 justify-content-between">
                      <div className="d-flex flex-column m-1 align-items-center col-6 chooseUserType-options text-center"
                        onClick={this.handleInstructorClick}
                        style={{backgroundColor: this.state.instructor ? '#F39119' : 'white'}}>
                        <img src='./Instructor.png' alt='Instructor'/>
                        <p> ¡Quiero ofrecer ofrecer mis servicios fitness! </p>
                      </div>
                      <div className="d-flex flex-column m-1 align-items-center col-6 chooseUserType-options text-center"
                        onClick={this.handleUserClick}
                        style={{backgroundColor: this.state.instructor? 'white' : '#F39119'}}>
                        <img src='./User.png' alt='Instructor'/>
                        <p> ¡Quiero hacer ejercicio! </p>
                      </div>
                    </div>
                  </div>
                  <button className="btn-primary col-3 m-2" onClick={this.handleAceptar}>Aceptar</button>
              </div>
      </div>
    )
  }
}

export default ChooseUserType;
