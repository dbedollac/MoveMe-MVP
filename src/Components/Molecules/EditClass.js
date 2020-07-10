import React from "react";
import { withRouter } from "react-router";
import FileUploadVideo from '../Cards/FileUploadVideo'
import FileUpload from '../Cards/FileUpload'
import {db, auth} from '../../Config/firestore'
import EditClassForm from '../Forms/EditClassForm'
import '../Views/NewClass.css'
import { Auth } from "../../Config/AuthContext";


class EditClass extends React.Component {
static contextType = Auth

  constructor(props) {
    super(props)
    this.state = {
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

    }

  render(){
    return (
      <div>
        <div className="col-12 NewClass-container d-flex flex-row align-items-start">
          <div className="col-5 d-flex flex-column align-items-start justify-content-between pt-2">
            <div className="video col-12">
              <FileUpload fileType='Pictures' title="Portada de la clase (Opcional)" name={this.state.uid? this.state.uid+'-'+this.props.claseID:null} pictureURL={this.props.claseData.imgURL}/>
            </div>
            <div className="video col-12 my-2">
              <FileUploadVideo videoWidth='100%' videoHeight='100%' fileType='Videos' title="Video para rentar (Opcional)" name={this.state.uid? this.state.uid+'-'+this.props.claseID:null} videoURL={this.props.claseData.videoURL}/>
            </div>
          </div>
          <div>
            <EditClassForm claseData={this.props.claseData} claseID={this.props.claseID}/>
          </div>
        </div>
      </div>
    )
  }


}

export default withRouter(EditClass)
