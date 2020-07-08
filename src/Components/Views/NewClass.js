import React from "react";
import Header from "../Molecules/Header";
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import FileUploadVideo from '../Cards/FileUploadVideo'
import FileUpload from '../Cards/FileUpload'
import {db, auth} from '../../Config/firestore'
import NewClassForm from '../Forms/NewClassForm'
import './NewClass.css'

class NewClass extends React.Component {
static contextType = Auth

  constructor() {
    super()
    this.state = {
      count: null,
      uid: null,
    }
    }

  componentDidMount(){
    let user = this.context.usuario;
    if (user) {
    this.setState({uid: user.uid})
    var docRef = db.collection("Instructors").doc(user.email);

      docRef.get().then((doc)=> {
          if (doc.exists) {
              this.setState({
              count: doc.data().countClasses +1
              })
          } else {
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
    }

    auth.onAuthStateChanged((user) => {
      if (user===null) {
          this.props.history.push("/login");
      }
    })
  }

  render(){
    return (
      <div>
      <Header type={1} />
        <div className="col-12 NewClass-container d-flex flex-row align-items-start">
          <div className="col-5 d-flex flex-column align-items-start justify-content-between pt-2">
            <div className="video col-12">
              <FileUpload fileType='Pictures' title="Portada de la clase (Opcional)" name={this.state.uid? this.state.uid +'-clase'+this.state.count:null}/>
            </div>
            <div className="video col-12 my-2">
              <FileUploadVideo videoWidth='100%' videoHeight='100%' fileType='Videos' title="Video para rentar (Opcional)" name={this.state.uid? this.state.uid +'-clase'+this.state.count:null}/>
            </div>
          </div>
          <div>
            <NewClassForm Count={this.state.count}/>
          </div>
        </div>
      </div>
    )
  }


}

export default withRouter(NewClass)
