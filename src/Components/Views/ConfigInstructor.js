import React from "react";
import Header from "../Molecules/Header";
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import './ConfigInstructor.css'
import {db} from '../../Config/firestore'
import FileUpload from '../Atoms/FileUpload'

class ConfigInstructor extends React.Component {
static contextType = Auth

  constructor() {
    super()
    this.state = {
      uid: null,
    }
  }

  componentDidMount(){
    let user = this.context.usuario;
    console.log(user);
    this.setState({uid: user.uid})
  }

  render(){
    return (
      <div>
        <Header type={0} title='Configuración'/>
        <div className="col-12 configInstructor-container">
          <div className="col-2">
            <FileUpload fileType='Pictures' name={this.state.uid + '-profile'}/>
          </div>
        </div>
      </div>
    )
  }
}

export default ConfigInstructor
