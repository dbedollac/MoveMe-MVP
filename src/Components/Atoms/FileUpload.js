import React from 'react';
import * as firebase from 'firebase'
import {storage} from "../../Config/firestore.js"

class FileUpload extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      uploadValue: 0,
      picture: './Upload.png'
    }
    this.handleOnChange = this.handleOnChange.bind(this);
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
      <div className="d-flex flex-column">
        <img src={this.state.picture} className="text-center"/>
        <progress value={this.state.uploadValue} max='100' className="progres-bar">
          {this.state.uploadValue} %
        </progress>
        <input type='file' onChange={this.handleOnChange.bind(this)}/>
      </div>
    )
  }
}

export default FileUpload
