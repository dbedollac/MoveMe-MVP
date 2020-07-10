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

useEffect(()=>{
  let user = usuario;

  if(user){
  setUid(user.uid)
  var docRef = db.collection("Instructors").doc(user.email);
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
          props.history.push("/login");
      }
    })
})

    return (
      <div>
        <Header type={1} title='Configuración'/>
        <div className="col-12 configInstructor-container d-flex flex-row align-items-start pt-4">
          <div className="col-4 foto-perfil">
            <FileUpload fileType='Pictures' name={uid + '-profile'} title="Foto de perfil" overlay='profile'/>
          </div>
          <div className="col-8 d-flex flex-column">
            <div className="col-12 d-flex align-self-center">
              <ConfigInstructorForm/>
            </div>
            <div className='col-12 d-flex flex-row justify-content-center align-items-center zoom-button p-2 mt-2'>
              <div className='d-flex flex-column align-items-center'>
                {zoomButton ? <p style={{color: 'gray'}}>Guarda primero tus datos de perfil</p> : null}
                <GetZoomToken disable={zoomButton}/>
              </div>
                <CameraVideoFill size={80} className='ml-5' color="#2C8BFF" />
            </div>
          </div>
        </div>
      </div>
    )

}

export default ConfigInstructor