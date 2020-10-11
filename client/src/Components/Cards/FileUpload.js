import React, { useState, useContext, useEffect } from "react";
import * as firebase from 'firebase'
import {storage} from "../../Config/firestore.js"
import { Image, CloudArrowUp } from 'react-bootstrap-icons';
import { Spinner} from 'react-bootstrap'
import DeleteStorage from '../Atoms/DeleteStorage'
import { useTranslation } from 'react-i18next';

function FileUpload (props){
  const [uploadValue,setuploadValue] = useState(0)
  const [picture,setPicture] = useState(null)
  const [loading,setLoading] = useState(false)
  const { t } = useTranslation();

  useEffect(()=>{
    if (props.name) {
      storage.ref("Pictures")
               .child(props.name)
               .getDownloadURL()
               .then(url => {
                 setPicture(url)
              }).catch(function (error) {
                console.error("Error", error);
              })
    }
  },[props.name])


  const handleOnChange = (e) => {
    setLoading(true)

    var type = props.fileType
    var fileName = props.name
    const file = e.target.files[0]
    const storageRef = firebase.storage().ref(`${type}/${fileName}`)
    const task = storageRef.put(file)

    task.on('state_changed', (snapshot) => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      setuploadValue(percentage)
    }, (error) => {
      console.error(error.message)
    }, () => {
      // Upload complete
      storage.ref("Pictures")
               .child(fileName)
               .getDownloadURL()
               .then(url => {
                 setPicture(url)
                 setLoading(false)
              }).catch(function (error) {
                console.error("No se ha subido ninguna foto de perfil ", error);
              })
    })
  }

    return (
      <div className='col-12'>
        <div className="FileUpload card">
          <div className='card-header d-flex flex-row justify-content-around'>
            <p className='text-center'><strong>{props.title}</strong></p>
            {picture?
              <div onClick={()=>{setPicture(null)}}><DeleteStorage type='Pictures' name={props.name} profile={props.profile?true:false} claseID={props.claseID}/></div>
              :null}
          </div>
          <div className='card-body d-flex flex-column align-items-center'>
            <label htmlFor='customFile-Foto'>
              {loading?<Spinner animation="border" />:picture?<img src={picture} className="text-center card-img-top"/>:
              <CloudArrowUp size={'7em'}/>}
            </label>
            <div className='d-flex flex-row align-items-center'>
              <progress value={uploadValue} max='100' className="progres-bar mr-2">
                {uploadValue} %
              </progress>
              {Math.round(uploadValue)} %
            </div>
          </div>
          <div className="card-footer d-flex flex-row justify-content-between align-items-center">
            <div className='custom-file'>
              <input id='customFile-Foto' type='file' onChange={handleOnChange} accept='image/*' className='custom-file-input'/>
              <label className="custom-file-label" htmlFor="customFile"><Image size='2em'/> {t('myClasses.24','Seleccionar foto')}</label>
            </div>
          </div>
        </div>
      </div>
    )
}

export default FileUpload
