import React,{useState, useContext, useEffect} from "react";
import { withRouter } from "react-router";
import FileUploadVideo from '../Cards/FileUploadVideo'
import FileUpload from '../Cards/FileUpload'
import {db, auth} from '../../Config/firestore'
import EditClassForm from '../Forms/EditClassForm'
import { Auth } from "../../Config/AuthContext";
import { useTranslation } from 'react-i18next';
import './NewClass.css'


function EditClass(props) {
const { usuario } = useContext(Auth);
const [count, setcount] = useState(null)
const { t } = useTranslation();

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

      auth.onAuthStateChanged((user) => {
        if (user===null) {
            props.history.push("/market");
        }
      })

    },[usuario,count])

    return (
      <div>
        <div className="NewClass-container d-flex flex-column flex-md-row align-items-start">
          <div className="col-md-4 d-flex flex-column align-items-center justify-content-between pt-2">
            <FileUpload fileType='Pictures' title={t('myClasses.26',"Portada de la clase (Opcional)")} name={usuario? usuario.uid+'-'+props.claseID:null} pictureURL={props.claseData.imgURL} claseID={props.claseID}/>
            <FileUploadVideo videoWidth='100%' videoHeight='100%' fileType='Videos' title={t('myClasses.27',"Video para rentar (Opcional)")} name={usuario? usuario.uid+'-'+props.claseID:null} videoURL={props.claseData.videoURL} edit={true} claseID={props.claseID}/>
          </div>

            <EditClassForm claseData={props.claseData} claseID={props.claseID}/>
        </div>
      </div>
    )


}

export default withRouter(EditClass)
