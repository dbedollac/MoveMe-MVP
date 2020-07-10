import React from "react";
import { CameraVideoFill } from 'react-bootstrap-icons';
import {zoomID, zoomRedirectURL} from '../../Config/ZoomCredentials'
import {proxyurl} from '../../Config/proxyURL'
import RefreshToken from './RefreshToken'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";

class CreateZoomMeeting extends React.Component {
  static contextType = Auth

  constructor(){
    super()
    this.state = {
      token: null
    }
  }

componentDidMount(){
  let user = this.context.usuario;

  var docRef = db.collection("Instructors").doc(user.email);
  docRef.get().then((doc)=>{
  if (doc.exists) {
      RefreshToken(user.email, doc.data().zoomRefreshToken)
    } else {
        console.log("No such document!");
    }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

   setMeeting = () =>{
     let user = this.context.usuario;
     var docRef = db.collection("Instructors").doc(user.email);
     docRef.get().then((doc)=>{
     if (doc.exists) {

           let url='https://api.zoom.us/v2/users/me/meetings'

           var data = {
             "topic": "Clase MoveMe",
             "type": 2,
             "start_time": "2020-07-09T16:00:00",
             "timezone": "America/Mexico_City",
             "settings": {
               "host_video": true,
               "join_before_host": true,
               "approval_type": 0,
               "registrants_email_notification": true
               }
             };
           let header = "Bearer "+doc.data().zoomToken;

           let init={method: 'POST',
           body: JSON.stringify(data),
           headers:{
             "authorization": header,
             "content-type" :"application/json",
             "origin": "https://2b0c1feb20cd.ngrok.io"
           },
           credentials: "include",
           }

           fetch(proxyurl+url,init).then((response)=>{
               Promise.resolve(response.json()).then( (resp) =>{
                 console.log(resp);
               }
               )
           })

         } else {
          console.log("No such document!");
      }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
      }

  render(){
  return(
    <button className='btn-lg btn-primary mt-2' onClick={this.setMeeting}> Agendar clase Zoom <CameraVideoFill /></button>
  )}
}

export default CreateZoomMeeting
