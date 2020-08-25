import React, { useState } from "react";
import {auth} from "../../Config/firestore";
import { withRouter } from "react-router";
import * as firebase from "firebase/app";
import Errores from "../Atoms/Errores";
import Header from "../Molecules/Header";
import { PersonCircle } from 'react-bootstrap-icons';
import { Asterisk } from 'react-bootstrap-icons';
import Login from './Login'
import google from '../Views/Images/Google.png'

const Signup = ({  history, location }) => {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    const [signup, setsignup] = useState(true);
    const [error, seterror] = useState("");
    const [password,setPassword] = useState("");
    const [password2,setPassword2] = useState("")

    const handleSignUp = async e => {
      if (password===password2) {
        e.preventDefault();
        const { usuario, clave } = e.target.elements;

        await auth
            .createUserWithEmailAndPassword(usuario.value, clave.value)
            .then(result => {
                console.log(result);
                history.push("/",[location.pathname]);
            })
            .catch(error => {
                seterror(error.message);
            });
      }else {
        e.preventDefault()
        seterror('Las contraseñas no coinciden')
      }
    };

    const handlePassword = (event) =>{
      setPassword(event.target.value)
    }

    const handlePassword2 = (event) =>{
      setPassword2(event.target.value)
    }

    const socialLogin = async (provider)=>{
        await auth
        .signInWithPopup(provider)
        .then(result => {
          history.push("/",[location.pathname])
            console.log(result);
        })
        .catch(error => {
            seterror(error.message)
        });
    }

    return (
      <div>{signup?
            <div className=" login-container">
              <form className="form-group d-flex flex-column align-items-center " onSubmit={handleSignUp}>
              <div className="d-flex flex-column login-form">
                  <div className="d-flex flex-column align-self-center m-2">
                    <h2 className="text-center ">Registro</h2>
                    {error? <Errores mensaje={error}/>:null}
                    <div className="text-center">
                      <PersonCircle/>
                      <input
                          name="usuario"
                          placeholder="Usuario"
                          className=" ml-2"/>
                    </div>
                    <div className="text-center">
                      <Asterisk/>
                      <input
                          name="clave"
                          type="password"
                          placeholder="Contraseña"
                          className=" ml-2"
                          onChange={handlePassword}/>
                    </div>
                    <div className="text-center">
                      <Asterisk/>
                      <input
                          name="clave2"
                          type="password"
                          placeholder="Confirmar contraseña"
                          className=" ml-2"
                          onChange={handlePassword2}/>
                    </div>
                    </div>
                        <div className="text-center m-2">
                          <button
                              className="btn-light col-11 border"
                           >
                              Registrarse
                          </button>
                        </div>
                          <div className="text-center">O{" "}</div>

                          <div className="align-items-center m-2 d-flex flex-column">
                            <button
                            className="btn-light m-1 col-12 border"
                            onClick={() => socialLogin(googleAuthProvider)}
                            >
                            <img src={google} alt='Google' style={{width:'2em'}} className='mr-1'/>
                            Ingresar con Google
                            </button>
                            <button
                                onClick={() => setsignup(false)}
                                className="btn-primary m-1 "
                            >
                                Ya tengo cuenta
                            </button>
                          </div>
                  </div>
              </form>
          </div>:
          <Login />}
      </div>
    );
};

export default withRouter(Signup);
