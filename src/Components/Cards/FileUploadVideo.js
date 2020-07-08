import React from 'react';
import * as firebase from 'firebase'
import {storage, db} from "../../Config/firestore.js"
import VideoPlayer from '../Atoms/VideoPlayer'
import { CameraVideoFill, CloudArrowUp } from 'react-bootstrap-icons';


class FileUploadVideo extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      uploadValue: 0,
      picture: null,
      video: null
    }
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  componentDidUpdate(){
    if(this.props.name){
      storage.ref("Videos")
               .child(this.props.name)
               .getDownloadURL()
               .then(url => {
                this.setState({video: url}) ;
              }).catch(function (error) {
                console.error("Error", error);
              })
  }}

  handleOnChange (e) {
    var type = this.props.fileType
    var fileName = this.props.name
    const file = e.target.files[0]
    const storageRef = firebase.storage().ref(`${type}/${fileName}`)
    const task = storageRef.put(file)

    task.on('state_changed', (snapshot) => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      this.setState({
        uploadValue: percentage
      })
    }, (error) => {
      console.error(error.message)
    }, () => {
      // Upload complete
      storage.ref("Videos")
               .child(this.props.name)
               .getDownloadURL()
               .then(url => {
                this.setState({video: url}) ;
              }).catch(function (error) {
                console.error("Error", error);
              })
    })
  }


  render () {
    return (
      <div className="FileUpload card">
        <p className='card-header col-12 text-center'><strong>{this.props.title}</strong></p>
        <div className='card-body d-flex flex-column align-items-center justify-content-start'>
        {this.state.video?<VideoPlayer videoWidth={this.props.videoWidth} videoHeight={this.props.videoHeight} Video={this.state.video} className="text-center card-img-top"/>
        :  <label for='video-input'>
            <CloudArrowUp size={'10em'}/>
          </label>}
          <div className='d-flex flex-row align-items-center'>
            <progress value={this.state.uploadValue} max='100' className="progres-bar mr-2">
              {this.state.uploadValue} %
            </progress>
            {Math.round(this.state.uploadValue*100)/100} %
          </div>
        </div>
        <div className="card-footer col-12 d-flex flex-row justify-content-between align-items-center">
          <CameraVideoFill size={'2em'}/>
          <input id='video-input' type='file' onChange={this.handleOnChange.bind(this)} accept='video/*'/>
        </div>
      </div>
    )
  }
}

export default FileUploadVideo
