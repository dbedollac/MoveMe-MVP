import React from 'react';
import * as firebase from 'firebase'
import {storage} from "../../Config/firestore.js"
import { Auth } from "../../Config/AuthContext";
import { Image, CloudArrowUp } from 'react-bootstrap-icons';

class FileUpload extends React.Component {
static contextType = Auth
  constructor (props) {
    super(props)
    this.state = {
      uploadValue: 0,
      picture: null
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
    let user = this.context.usuario;
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
                this.setState({picture: url}) ;
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
          <label for='file-input'>
            {this.state.picture?<img src={this.state.picture} className="text-center card-img-top"/>:
            <CloudArrowUp size={'10em'}/>}
          </label>
          <div className='d-flex flex-row align-items-center'>
            <progress value={this.state.uploadValue} max='100' className="progres-bar mr-2">
              {this.state.uploadValue} %
            </progress>
            {Math.round(this.state.uploadValue*100)/100} %
          </div>
        </div>
        <div className="card-footer col-12 d-flex flex-row justify-content-between align-items-center">
          <Image size={'2em'}/>
          <input id='file-input' type='file' onChange={this.handleOnChange.bind(this)} accept='image/*'/>
        </div>
      </div>
    )
  }
}

export default FileUpload
