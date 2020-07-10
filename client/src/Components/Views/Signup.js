import React, { useState } from "react";
import {auth} from "../../Config/firestore";
import { withRouter } from "react-router";
import Errores from "../Atoms/Errores";
import Header from "../Molecules/Header";
import './Login.css'
import { PersonCircle } from 'react-bootstrap-icons';
import { Asterisk } from 'react-bootstrap-icons';

const Signup = ({ setsignup, history }) => {
    const [error, seterror] = useState("");
    const handleSignUp = async e => {
        e.preventDefault();
        const { usuario, clave } = e.target.elements;

        await auth
            .createUserWithEmailAndPassword(usuario.value, clave.value)
            .then(result => {
                console.log(result);
                history.push("/");
            })
            .catch(error => {
                seterror(error.message);
            });
    };
    return (
      <div>
            <div className="col-12 login-container">
              <form className="form-group d-flex flex-column col-12 align-items-center " onSubmit={handleSignUp}>
              <div className="d-flex flex-column col-6 login-form">
                  <div className="d-flex flex-column align-self-center col-10 m-2">
                    <h2 className="text-center ">Registro</h2>
                    {error? <Errores mensaje={error}/>:null}
                    <div className="text-center">
                      <PersonCircle/>
                      <input
                          name="usuario"
                          placeholder="Usuario"
                          className="col-9 ml-2"/>
                    </div>
                    <div className="text-center">
                      <Asterisk/>
                      <input
                          name="clave"
                          type="password"
                          placeholder="Clave"
                          className="col-9 ml-2"/>
                    </div>
                    </div>
                        <div className="text-center m-2">
                          <button
                              className="btn-light col-4"
                           >
                              Registrar
                          </button>
                        </div>
                          <div className="text-center">O{" "}</div>

                          <div className="align-items-center m-2 d-flex flex-column">
                            <button
                                onClick={() => setsignup(false)}
                                className="btn-primary m-1 col-4"
                            >
                                !Ingresa Ahora!
                            </button>
                          </div>
                  </div>
              </form>
          </div>
      </div>
    );
};

export default withRouter(Signup);
