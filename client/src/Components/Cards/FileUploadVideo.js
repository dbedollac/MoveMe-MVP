import React, { useState, useContext, useEffect } from "react";
import * as firebase from 'firebase'
import {storage, db} from "../../Config/firestore.js"
import VideoPlayer from '../Atoms/VideoPlayer'
import { CameraVideoFill, CloudArrowUp } from 'react-bootstrap-icons';
import { Spinner} from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

function FileUploadVideo (props) {
  const [uploadValue,setuploadValue] = useState(0)
  const [video,setVideo] = useState(props.videoURL)
  const [loading,setLoading] = useState(false)
  const { t } = useTranslation();

  useEffect(()=>{
      if (props.name) {
        storage.ref("Videos")
                 .child(props.name)
                 .getDownloadURL()
                 .then(url => {
                   setVideo(url)
                }).catch(function (error) {
                  console.error("Error", error);
                })
      }
    },[])

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
        storage.ref("Videos")
                 .child(props.name)
                 .getDownloadURL()
                 .then(url => {
                   setVideo(url)
                   setLoading(false)
                }).catch(function (error) {
                  console.error("Error", error);
                })
      })
    }


    return (
      <div className='col-12'>
        <div className="FileUpload card">
          <p className='card-header text-center'><strong>{props.title}</strong></p>
          <div className='card-body d-flex flex-column align-items-center justify-content-start'>
          {loading?<Spinner animation="border" />:video?<VideoPlayer videoWidth={props.videoWidth} videoHeight={props.videoHeight} Video={video} className="text-center card-img-top"/>
          :  <label for='customFile-Video'>
              <CloudArrowUp size={'7em'}/>
            </label>}
            <div className='d-flex flex-row align-items-center'>
              <progress value={uploadValue} max='100' className="progres-bar mr-2">
                {uploadValue} %
              </progress>
              {Math.round(uploadValue*100)/100} %
            </div>
          </div>
          <div className="card-footer d-flex flex-row justify-content-between align-items-center">
            <div className='custom-file'>
              <input id='customFile-Video' type='file' onChange={handleOnChange} accept='video/*' className='custom-file-input'/>
              <label className="custom-file-label" htmlFor="customFile"><CameraVideoFill size='2em'/> {t('myClasses.25','Seleccionar video')}</label>
            </div>
          </div>
        </div>
      </div>
    )
}

export default FileUploadVideo
