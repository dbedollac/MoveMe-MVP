import React, { useState, useContext, useEffect } from "react";
import Header from "../Molecules/Header";
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import './ConfigInstructor.css'
import FileUpload from '../Cards/FileUpload'
import ConfigInstructorForm from '../Forms/ConfigInstructorForm'
import GetZoomToken from '../Atoms/GetZoomToken'
import { CameraVideoFill } from 'react-bootstrap-icons';
import {db, auth} from '../../Config/firestore'

function ConfigInstructor(props) {
const { usuario } = useContext(Auth);
const [uid, setUid] = useState(null);
const [zoomButton, setZoomButton] = useState(true)
const [newInstructor, setNewInstructor] = useState(true);

const searchInstructor = () =>{
    if(usuario){
    db.collection("Instructors").doc(usuario.uid).get().then( (doc) => {
      if (doc.data().zoomToken.length>0) {
        setNewInstructor(doc.data().new)
      }
      });
  }
  }

useEffect(()=>{
  let user = usuario;

  if(user){
  setUid(user.uid)
  var docRef = db.collection("Instructors").doc(user.uid);
  docRef.onSnapshot((doc)=>{
  if (doc.exists) {
    var data = doc.data()
      if(data.firstName.length>0){
        setZoomButton(false)
          }
      }}
      )
    }

    auth.onAuthStateChanged((user) => {
      if (user===null) {
          props.history.push("/market");
      }
    })

    searchInstructor()
},[usuario])

    return (
      <>
        <Header instructor={newInstructor?false:true} />
          <div className='configInstructor-container'>

            <div className="d-flex flex-column flex-lg-row align-items-start pt-4">
              <div className="col-lg-4 foto-perfil d-flex flex-column justify-content-around">

                <div className='d-flex flex-row justify-content-center align-items-center zoom-button mb-2 pb-3'>
                  <div className='d-flex flex-column align-items-center'>
                    {zoomButton ? <p style={{color: 'gray'}}>Guarda primero tus datos de perfil</p> : null}
                    <GetZoomToken disable={zoomButton}/>
                  </div>
                    <CameraVideoFill size={'50px'} className='ml-5' color="#2C8BFF" />
                </div>

                <FileUpload fileType='Pictures' name={uid + '-profile'} title="Foto de perfil" overlay='profile'/>
              </div>

              <div className="col-lg-8 d-flex flex-column pt-lg-0 pt-4 mb-3">
                <div className="d-flex align-self-center">
                  <ConfigInstructorForm newInstructor={newInstructor}/>
                </div>
              </div>
            </div>

          </div>
      </>
    )

}

export default ConfigInstructor
