import React from 'react';
import * as firebase from 'firebase'
import {storage} from "../../Config/firestore.js"
import { Auth } from "../../Config/AuthContext";

class FileUpload extends React.Component {
static contextType = Auth
  constructor (props) {
    super(props)
    this.state = {
      uploadValue: 0,
      picture: './Upload.png'
    }
    this.handleOnChange = this.handleOnChange.bind(this);
    console.log(this.props.overlay);
  }

  componentDidMount(){
    let user = this.context.usuario;
    if (this.props.overlay !== null) {
      storage.ref("Pictures")
               .child(user.uid +'-'+this.props.overlay)
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
            <img src={this.state.picture} className="text-center card-img-top"/>
          </label>
          <progress value={this.state.uploadValue} max='100' className="progres-bar">
            {this.state.uploadValue} %
          </progress>
        </div>
          <input id='file-input' type='file' onChange={this.handleOnChange.bind(this)} className="card-footer col-12" accept='image/*'/>
      </div>
    )
  }
}

export default FileUpload
