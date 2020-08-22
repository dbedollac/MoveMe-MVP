import React, { useState, useContext, useEffect } from "react";
import './ChooseUserType.css'
import Header from "../Molecules/Header";
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import {Redirect} from "react-router-dom";
import {db, auth} from '../../Config/firestore'
import logo from './Images/logo.jpg'
import {proxyurl} from '../../Config/proxyURL'

function ChooseUserType(props) {
const { usuario } = useContext(Auth);
const [nombre, setNombre] = useState(null);
const [instructor, setInstructor] = useState(true);
const [newUser, setNewUser] = useState(true);
const [newInstructor, setNewInstructor] = useState(true);
const [aceptar, setAceptar] = useState(false);

const createSrtipeCustomer = () =>{
  fetch(proxyurl+'stripeAPI/create-customer', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: usuario.email,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        db.collection('Users').doc(usuario.uid).set({
          stripeCustomerID:result.customer.id
        },{merge: true}).catch(error=>console.log(error))
      });
}

const  handleInstructorClick = () => {
  setInstructor(true)
  }

const  handleUserClick = () => {
  setInstructor(false)
  }

const searchInstructor = () =>{
    if(usuario){
    db.collection("Instructors").doc(usuario.uid).get().then( (doc) => {
      if (doc.exists) {
        setNewInstructor(false)
      }
      });
  }
  }

const searchUser = () =>{
    if (usuario) {
    db.collection("Users").doc(usuario.uid).get().then( (doc) => {
    if (doc.exists) {
      setNewUser(false)
    }
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
              uid: usuario.uid,
              trialClass: 0
            },{merge:true})
              createSrtipeCustomer()
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
          return <Redirect to="/como-iniciar"/>
        } else {
          return <Redirect to="/"/>
        }
      }else {
        props.history.push('/market',[props.return])
      }
    }

    return(
      <div>
          <Header empty={true}/>
              <div className="col-12 chooseUserType-container">

                <h3 className='text-center pt-2'>Hola {nombre} :)</h3>
                <div className="chooseUserType-pregunta text-center pt-2"><p>¿Cómo quieres utilizar MoveMe?</p></div>

                    <div className="d-flex flex-column flex-md-row col-12 justify-content-around align-items-center">
                      <div className="d-flex flex-column align-items-center col-10 col-md-5 chooseUserType-options text-center"
                        onClick={handleInstructorClick}
                        style={{backgroundColor: instructor ? '#F39119' : 'white'}}>
                        <h4>Instructor</h4>
                        <img src='./Instructor.png' alt='Instructor'/>
                        <p> ¡Quiero ofrecer ofrecer mis servicios fitness! </p>
                      </div>

                      <div className="d-flex flex-column align-items-center col-10 col-md-5 chooseUserType-options text-center"
                        onClick={handleUserClick}
                        style={{backgroundColor: instructor? 'white' : '#F39119'}}>
                        <h4>Usuario</h4>
                        <img src='./User.png' alt='Instructor'/>
                        <p> ¡Quiero hacer ejercicio! </p>
                      </div>
                    </div>

                <div className='col-12 text-center'>
                  <button className="btn-primary btn-lg col-5 mt-4" onClick={handleAceptar}>Aceptar</button>
                </div>
            </div>
      </div>
    )

}

export default withRouter(ChooseUserType);
