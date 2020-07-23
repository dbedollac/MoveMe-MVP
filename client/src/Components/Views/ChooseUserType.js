import React, { useState, useContext, useEffect } from "react";
import './ChooseUserType.css'
import Header from "../Molecules/Header";
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import {Redirect} from "react-router-dom";
import {db, auth} from '../../Config/firestore'
import logo from './Images/logo.jpg'

function ChooseUserType(props) {
const { usuario } = useContext(Auth);
const [nombre, setNombre] = useState(null);
const [instructor, setInstructor] = useState(true);
const [newUser, setNewUser] = useState(true);
const [newInstructor, setNewInstructor] = useState(true);
const [aceptar, setAceptar] = useState(false);


const  handleInstructorClick = () => {
  setInstructor(true)
  }

const  handleUserClick = () => {
  setInstructor(false)
  }

const searchInstructor = () =>{
    if(usuario){
    db.collection("Instructors").where("uid", "==", usuario.uid).get().then( (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      setNewInstructor(false)
          });
      });
  }
  }

const searchUser = () =>{
    if (usuario) {
    db.collection("Users").where("uid", "==", usuario.uid).get().then( (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      setNewUser(false)
          });
      });
  }
  }

const handleAceptar = () =>{
  setAceptar(true)
    if (instructor) {
      if (newInstructor) {
        db.collection("Instructors").doc(usuario.uid).set({
        email: usuario.email,
        uid: usuario.uid,
        profileName: '',
        firstName: "",
        lastName: "",
        CLABE: "",
        noTarjeta: "",
        selfDescription:"",
        disableTrialClasses: false,
        website: "",
        zoomToken: "",
        zoomRefreshToken: "",
        countClasses: 0,
        new: true,
        monthlyProgram: {
          Active: false,
          Price: null
        }
        });
      }
        } else {
            if (newUser) {
              db.collection("Users").doc(usuario.uid).set({
              email: usuario.email,
              uid: usuario.uid
              })
            }
              }
            }

  useEffect(()=>{
    auth.onAuthStateChanged((usuario) => {
      if (usuario===null) {
          props.history.push("/market");
      }
    })

    usuario?usuario.displayName? setNombre(usuario.displayName):setNombre(usuario.email):setNombre(null)
    searchInstructor()
    searchUser()
  },[usuario])


    if (aceptar) {
      if (instructor) {
        if (newInstructor) {
          return <Redirect to="/configuration-instructor"/>
        } else {
          return <Redirect to="/"/>
        }
      }else {
        props.history.push('/market',[props.return])
      }
    }

    return(
      <div>
          <Header type={newInstructor?0:1} title='M O V E M E'/>
              <div className="col-12 chooseUserType-container d-flex flex-column justify-content-start align-items-center ">
                <div className="d-flex flex-column m-2">
                  <h2>Hola {nombre} :)</h2>
                </div>
                <div className="chooseUserType-pregunta text-center pt-2 col-8"><p>¿Cómo quieres utilizar MoveMe?</p></div>
                  <div className="d-flex flex-column align-items-center">
                    <div className="d-flex flex-row col-12 justify-content-between">
                      <div className="d-flex flex-column m-1 align-items-center col-6 chooseUserType-options text-center"
                        onClick={handleInstructorClick}
                        style={{backgroundColor: instructor ? '#F39119' : 'white'}}>
                        <img src='./Instructor.png' alt='Instructor'/>
                        <p> ¡Quiero ofrecer ofrecer mis servicios fitness! </p>
                      </div>
                      <div className="d-flex flex-column m-1 align-items-center col-6 chooseUserType-options text-center"
                        onClick={handleUserClick}
                        style={{backgroundColor: instructor? 'white' : '#F39119'}}>
                        <img src='./User.png' alt='Instructor'/>
                        <p> ¡Quiero hacer ejercicio! </p>
                      </div>
                    </div>
                  </div>
                  <button className="btn-primary col-3 m-2" onClick={handleAceptar}>Aceptar</button>
              </div>
      </div>
    )

}

export default withRouter(ChooseUserType);
