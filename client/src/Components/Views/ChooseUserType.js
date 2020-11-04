import React, { useState, useContext, useEffect } from "react";
import './ChooseUserType.css'
import Header from "../Molecules/Header";
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import {Redirect} from "react-router-dom";
import {db, auth} from '../../Config/firestore'
import logo from './Images/logo.jpg'
import {proxyurl} from '../../Config/proxyURL'
import {Button, Modal} from 'react-bootstrap'
import AvisoPrivacidad0 from '../Atoms/AvisoPrivacidad0'
import TerminosCondiciones0 from '../Atoms/TerminosCondiciones0'
import WelcomeUserMail from '../Atoms/WelcomeUserMail'
import { useTranslation } from 'react-i18next';

function ChooseUserType(props) {
const { usuario } = useContext(Auth);
const [nombre, setNombre] = useState(null);
const [instructor, setInstructor] = useState(true);
const [newUser, setNewUser] = useState(true);
const [newInstructor, setNewInstructor] = useState(true);
const [aceptar, setAceptar] = useState(false);
const [next, setNext] = useState(false);
const [show, setShow] = useState(false);
const { t } = useTranslation();

const handleShow = () => setShow(!show);

const handleAceptar = (event) =>{
  setAceptar(!aceptar)
}

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

const handleNext = () =>{
  setNext(true)
    if (instructor) {
      if (newInstructor) {
        db.collection("Instructors").doc(usuario.uid).set({
        email: usuario.email,
        uid: usuario.uid,
        profileName: '',
        firstName: "",
        lastName: "",
        CLABE: "",
        selfDescription:"",
        disableTrialClasses: false,
        website: "",
        zoomToken: "",
        zoomRefreshToken: "",
        countClasses: 0,
        new: true,
        monthlyProgram: {
          Price: null
        },
        aceptoTerminosYCondiciones: aceptar,
        linkIG:"",
        linkFB:"",
        RFC:"",
        CURP:""
        });
      }
        } else {
            if (newUser) {
              db.collection("Users").doc(usuario.uid).set({
              email: usuario.email,
              uid: usuario.uid,
              trialClass: 0,
              aceptoTerminosYCondiciones: aceptar
            },{merge:true})
              db.collection('Mails').doc().set({
              to:[usuario.email],
              message:{
                subject:'Bienvenido(a) a MoveMe',
                html: WelcomeUserMail(nombre)
              }
            })
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


    if (next) {
      if (instructor) {
        if (newInstructor) {
          return <Redirect to="/start"/>
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

                <h3 className='text-center pt-2'>{t('type.1','Hola')} {nombre} :)</h3>
                <div className="chooseUserType-pregunta text-center pt-2"><p>{t('type.2','¿Cómo quieres utilizar MoveMe?')}</p></div>

                    <div className="d-flex flex-column flex-md-row col-12 justify-content-around align-items-center">
                      <div className="d-flex flex-column align-items-center col-10 col-md-5 chooseUserType-options text-center"
                        onClick={handleInstructorClick}
                        style={{backgroundColor: instructor ? '#F39119' : 'white'}}>
                        <h4>{t('type.12','Instructor')}</h4>
                        <img src='./Instructor.png' alt='Instructor'/>
                        <p> {t('type.3','¡Quiero ofrecer mis servicios fitness!')} </p>
                      </div>

                      <div className="d-flex flex-column align-items-center col-10 col-md-5 chooseUserType-options text-center"
                        onClick={handleUserClick}
                        style={{backgroundColor: instructor? 'white' : '#F39119'}}>
                        <h4>{t('type.13','Usuario')}</h4>
                        <img src='./User.png' alt='Instructor'/>
                        <p> {t('type.4','¡Quiero hacer ejercicio!')} </p>
                      </div>
                    </div>

                <div className='col-12 text-center'>
                  <button className="btn-primary btn-lg col-5 mt-4" onClick={newInstructor||newUser?handleShow: handleNext}>{t('type.5','Aceptar')}</button>
                </div>
            </div>

            <Modal
              show={show}
              onHide={handleShow}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>{t('type.6','Términos y Condiciones')} <br/>& {t('type.7','Aviso de Privacidad')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div style={{ overflowY: 'scroll', height:'250px'}}>
                  <TerminosCondiciones0 instructor={instructor}/>
                  <AvisoPrivacidad0 instructor={instructor}/>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className='d-flex flex-column align-items-start'>
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck1" value={aceptar} onChange={handleAceptar}/>
                    <label class="custom-control-label" for="customCheck1">{t('type.8','Acepto los')} <strong>{t('type.6','Términos y condiciones')}</strong> {t('type.9','y he leído el')} <strong>{t('type.7','Aviso de Privacidad')}</strong></label>
                  </div>
                  <div className='d-flex flex-row justify-content-around col-12 mt-2'>
                    <Button variant="secondary" onClick={handleShow}>
                      {t('type.10','Cancelar')}
                    </Button>
                    <Button variant="success" onClick={handleNext} disabled={!aceptar}>{t('type.11','Continuar')}</Button>
                  </div>
                </div>
              </Modal.Footer>
            </Modal>
      </div>
    )

}

export default withRouter(ChooseUserType);
