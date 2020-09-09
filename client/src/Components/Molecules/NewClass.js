import React, { useState, useContext, useEffect } from "react";
import Header from "../Molecules/Header";
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import FileUploadVideo from '../Cards/FileUploadVideo'
import FileUpload from '../Cards/FileUpload'
import {db, auth} from '../../Config/firestore'
import NewClassForm from '../Forms/NewClassForm'
import { useTranslation } from 'react-i18next';
import './NewClass.css'

function NewClass(props) {
const { usuario } = useContext(Auth);
const [count, setcount] = useState(null)
const { t , i18n } = useTranslation()

  useEffect(()=>{
    if (usuario) {
    var docRef = db.collection("Instructors").doc(usuario.uid);

      docRef.get().then((doc)=> {
          if (doc.exists) {
              setcount(doc.data().countClasses+1)
          } else {
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
    }

    auth.onAuthStateChanged((user) => {
      if (user===null) {
          props.history.push("/market");
      }
    })

  },[usuario,count])

    return (
      <div>
        <div className="NewClass-container d-flex flex-column flex-md-row align-items-start">

            <div className="col-md-4 d-flex flex-column align-items-center justify-content-between pt-2">
              <FileUpload fileType='Pictures' title={t('myClasses.26',"Portada de la clase (Opcional)")} name={usuario.uid? usuario.uid +'-clase'+count:null}/>
              <FileUploadVideo videoWidth='100%' videoHeight='100%' fileType='Videos' title={t('myClasses.27',"Video para rentar (Opcional)")} name={usuario.uid? usuario.uid +'-clase'+count:null}/>
            </div>

            <NewClassForm Count={count}/>
        </div>
      </div>
    )



}

export default withRouter(NewClass)
