import React, { useState, useContext, useEffect } from "react";
import * as firebase from 'firebase'
import {storage} from "../../Config/firestore.js"
import { Image, CloudArrowUp } from 'react-bootstrap-icons';
import { Spinner} from 'react-bootstrap'
import DeleteStorage from '../Atoms/DeleteStorage'
import { useTranslation } from 'react-i18next';

function FileUploadPDF (props){
  const [uploadValue,setuploadValue] = useState(0)
  const [constancia,setConstancia] = useState(null)
  const [inputName,setinputName] = useState(null)
  const { t } = useTranslation();

  useEffect(()=>{
    if (props.name) {
      storage.ref("SAT")
               .child(props.name)
               .getDownloadURL()
               .then(url => {
                 setConstancia(url)
              }).catch(function (error) {
                console.error("Error", error);
              })
    }
  },[props.name])

  const handleOnChange = (e) => {

    //Subir el pdf a firebase
    var fileName = props.name
    const file = e.target.files[0]
    const storageRef = firebase.storage().ref(`SAT/${fileName}`)
    const task = storageRef.put(file)

    //Cambiar la etiqueta del input por el nombre del PDF seleccionado
    setinputName(e.target.files[0].name)
  }

    return (
      <div className='d-flex flex-column'>
        <div className='custom-file'>
          <label htmlFor="PDF-SAT" className='custom-file-label'>{inputName?inputName:t('config.28','Constancia de Situación Fiscal')}</label>
          <input id='SAT-PDF' type='file' onChange={handleOnChange} accept='application/pdf' className='custom-file-input'/>
        </div>
        {constancia?<i style={{fontSize:'small',color:'blue'}}><a href={constancia} target="_blank">{t('config.27','Ver mi Constancia')}</a></i>:null}
      </div>
    )
}

export default FileUploadPDF
