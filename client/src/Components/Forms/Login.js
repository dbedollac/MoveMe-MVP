import React, { useState, useContext, useEffect } from "react";
import Signup from "./Signup";
import { withRouter } from "react-router";
import * as firebase from "firebase/app";
import {auth} from "../../Config/firestore";
import { Auth } from "../../Config/AuthContext";
import Errores from '../Atoms/Errores'
import Header from "../Molecules/Header";
import { PersonCircle } from 'react-bootstrap-icons';
import { Asterisk } from 'react-bootstrap-icons';
import googleLogo from '../Views/Images/Google.png'
import facebookLogo from '../Views/Images/Facebook.png'
import {Redirect} from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Login = ({ history, location }) => {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
    const [signup, setsignup] = useState(false);
    const { usuario } = useContext(Auth);
    const [error, seterror] = useState('')
    const [forgottenpassword,setForgottenpassword] = useState(false)
    const [email, setEmail] = useState(null)
    const { t } = useTranslation()

    useEffect(() => {
        if (usuario) {
            history.push("/",[location.pathname]);
        }
    }, [history, usuario]);

    const correoClave = async e => {
        e.preventDefault();
        const { usuario, clave } = e.target.elements;

        await auth
            .signInWithEmailAndPassword(usuario.value, clave.value)
            .then(result => {
                console.log(result);
                history.push("/",[location.pathname]);
            })
            .catch(error => {
                seterror(error.message)
            });

    };


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

    const resetPassword = () =>{
        auth.sendPasswordResetEmail(email).then(function() {
        console.log('Email sent.')
      }).catch(function(error) {
        console.log(error)
      });
    }

    const forgottenPassword = () =>{
      setForgottenpassword(!forgottenpassword)
    }

    const handleMail = (event) =>{
      setEmail(event.target.value)
    }


    if (forgottenpassword) {
      return(
              <div className="login-container">
                <form className="form-group d-flex flex-column align-items-center " onSubmit={resetPassword}>
                <div className="d-flex flex-column login-form">
                    <div className="d-flex flex-column align-self-center m-2">
                      <h3 className="text-center ">{t('header.19','Enviar mail para restablecer contraseña')}</h3>
                      <div className="text-center">
                        <PersonCircle/>
                        <input
                            onChange={handleMail}
                            className="ml-2"
                            placeholder='email'/>
                      </div>
                      <p className='text-right' onClick={forgottenPassword} style={{cursor:'pointer'}}><i>{t('header.20','Regresar')}</i></p>
                      </div>
                          <div className="text-center m-2">
                            <button
                                className="btn-light "
                             >
                                {t('header.21','Enviar')}
                            </button>
                          </div>
                    </div>
                </form>
              </div>
    )
    }else {
    return (
                <div>
                    {!signup ? (
                      <div className=" login-container">
                        <form className="form-group d-flex flex-column align-items-center " onSubmit={correoClave}>
                        <div className="d-flex flex-column login-form">
                          <h2 className='text-center'>{t('header.24','Ingresar')}</h2>
                            <div className="d-flex flex-column align-self-center m-2">
                              {error? <Errores mensaje={error}/>:null}
                              <div className="text-center">
                                <PersonCircle/>
                                <input
                                    name="usuario"
                                    placeholder={t('header.22',"email")}
                                    className=" ml-2"/>
                              </div>
                              <div className="text-center">
                                <Asterisk/>
                                <input
                                    name="clave"
                                    type="password"
                                    placeholder={t('header.23',"Contraseña")}
                                    className=" ml-2"/>
                              </div>
                              <p className='text-right' onClick={forgottenPassword} style={{cursor:'pointer',fontSize:'small'}}><i>{t('header.32',"Olvidé mi contraseña")}</i></p>
                              </div>
                                  <div className="text-center">
                                    <button
                                        className="btn-light col-11 border"
                                     >
                                        {t('header.24',"Ingresar")}
                                    </button>
                                  </div>
                                    <div className="text-center">O{" "}</div>

                                    <div className="align-items-center m-2 d-flex flex-column">
                                      <button
                                      className="btn-light m-1 col-12 border text-left"
                                      onClick={() => socialLogin(googleAuthProvider)}
                                      >
                                      <img src={googleLogo} alt='Google' style={{width:'2em'}} className='mr-1'/>
                                      {t('header.25',"Ingresar con Google")}
                                      </button>

                                      <button
                                      className="btn-light m-1 col-12 border text-left"
                                      onClick={() => socialLogin(facebookAuthProvider)}
                                      >
                                      <img src={facebookLogo} alt='Facebook' style={{width:'2em'}} className='mr-1'/>
                                      {t('header.26',"Ingresar con Facebook")}
                                      </button>

                                      <button
                                          onClick={() => setsignup(true)}
                                          className="btn-primary m-1"
                                      >
                                          {t('header.27',"Registrarse")}
                                      </button>
                                    </div>
                            </div>
                        </form>
                    </div>
                    ) : (
                        <Signup setsignup={setsignup} />
                    )}
                </div>
    );
  }
};
export default withRouter(Login);
