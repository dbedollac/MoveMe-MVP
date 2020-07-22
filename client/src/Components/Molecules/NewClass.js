import React, { useState, useContext, useEffect } from "react";
import Header from "../Molecules/Header";
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import FileUploadVideo from '../Cards/FileUploadVideo'
import FileUpload from '../Cards/FileUpload'
import {db, auth} from '../../Config/firestore'
import NewClassForm from '../Forms/NewClassForm'
import './NewClass.css'

function NewClass(props) {
const { usuario } = useContext(Auth);
const [count, setcount] = useState(null)


  useEffect(()=>{
    if (usuario) {
    var docRef = db.collection("Instructors").doc(usuario.uid);

      docRef.get().then((doc)=> {
          if (doc.exists) {
              setcount(doc.data().countClasses+1)
          } else {
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
    }

    auth.onAuthStateChanged((usuario) => {
      if (usuario===null) {
          props.history.push("/login");
      }
    })
  },[usuario,count])

    return (
      <div>
      {console.log(count)}
        <div className="col-12 NewClass-container d-flex flex-row align-items-start">
          <div className="col-5 d-flex flex-column align-items-start justify-content-between pt-2">
            <div className="video col-12">
              <FileUpload fileType='Pictures' title="Portada de la clase (Opcional)" name={usuario.uid? usuario.uid +'-clase'+count:null}/>
            </div>
            <div className="video col-12 my-2">
              <FileUploadVideo videoWidth='100%' videoHeight='100%' fileType='Videos' title="Video para rentar (Opcional)" name={usuario.uid? usuario.uid +'-clase'+count:null}/>
            </div>
          </div>
          <div>
            <NewClassForm Count={count}/>
          </div>
        </div>
      </div>
    )



}

export default withRouter(NewClass)
