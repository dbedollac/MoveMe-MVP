import React from 'react';
import * as firebase from 'firebase'
import {storage} from "../../Config/firestore.js"
import { Image, CloudArrowUp } from 'react-bootstrap-icons';
import { Spinner} from 'react-bootstrap'

class FileUpload extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      uploadValue: 0,
      picture: null,
      loading: false
    }
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  componentDidMount(){
    if (this.props.pictureURL) {
      this.setState({
        picture: this.props.pictureURL
      })
    }
  }

  componentDidUpdate(){
    if (this.props.name) {
      storage.ref("Pictures")
               .child(this.props.name)
               .getDownloadURL()
               .then(url => {
                this.setState({picture: url}) ;
              }).catch(function (error) {
                console.error("Error", error);
              })
    }

  }

  handleOnChange (e) {
    this.setState({
      loading:true
    })
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
      storage.ref("Pictures")
               .child(fileName)
               .getDownloadURL()
               .then(url => {
                this.setState({picture: url,
                              loading: false}) ;
              }).catch(function (error) {
                console.error("No se ha subido ninguna foto de perfil ", error);
              })
    })
  }

  render () {

    return (
      <div className="FileUpload card">
        <p className='card-header col-12 text-center'><strong>{this.props.title}</strong></p>
        <div className='card-body d-flex flex-column align-items-center'>
          <label htmlFor='file-input'>
            {this.state.loading?<Spinner animation="border" />:this.state.picture?<img src={this.state.picture} className="text-center card-img-top"/>:
            <CloudArrowUp size={'10em'}/>}
          </label>
          <div className='d-flex flex-row align-items-center'>
            <progress value={this.state.uploadValue} max='100' className="progres-bar mr-2">
              {this.state.uploadValue} %
            </progress>
            {Math.round(this.state.uploadValue*100)/100} %
          </div>
        </div>
        <div className="card-footer d-flex flex-row justify-content-between align-items-center">
          <div className='custom-file'>
            <input id='customFile' type='file' onChange={this.handleOnChange.bind(this)} accept='image/*' className='custom-file-input'/>
            <label className="custom-file-label" htmlFor="customFile"><Image size='2em'/> Selecciona una foto</label>
          </div>
        </div>
      </div>
    )
  }
}

export default FileUpload
