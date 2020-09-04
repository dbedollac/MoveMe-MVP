import React, { useState, useContext, useEffect } from "react";
import {proxyurl} from '../../Config/proxyURL'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { TrashFill } from 'react-bootstrap-icons';
import {Button, Modal, Spinner} from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

function DeleteZoomMeeting(props) {
  const { usuario } = useContext(Auth);
  const [show, setShow] = useState(false);
  const [loading,setLoading] = useState(false)
  const { t } = useTranslation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const deleteMeeting = () =>{
    setLoading(true)
    var docRef = db.collection("Instructors").doc(usuario.uid);
    docRef.get().then((doc)=>{

    if (doc.exists) {
          let url=proxyurl+"zoomAPI/delete"

          let init = {
            method: 'POST',
            body: JSON.stringify({
                 token: doc.data().zoomToken,
                 meetingID:props.meetingID
             }),
             headers: {
               "content-type": "application/json"
             }
          }

          fetch(url,init).then((response)=>{
                var docRef = db.collection("Instructors").doc(usuario.uid);
                docRef.collection('ZoomMeetingsID').where("meetingID", "==", props.meetingID).get()
                    .then(function(querySnapshot) {
                      querySnapshot.forEach(function(doc) {
                        console.log(doc)
                        doc.ref.delete().then(window.location.reload(false))
                        .catch(function(error) {
                            console.log("Error getting documents: ", error)
                          })
                      })
                    })
                    .catch(function(error) {
                        console.log("Error getting documents: ", error);
                    });

          }, function(error) {
              console.log(error.message)
              window.location.reload(false)
          })

        } else {
         console.log("No such document!");
     }
     }).catch(function(error) {
         console.log("Error getting document:", error);
     });
     }

  return(
    <div>
      <TrashFill color='black' onClick={handleShow} style={{cursor:'pointer'}} size={'20px'}/>

     <Modal
       show={show}
       onHide={handleClose}
       backdrop="static"
       keyboard={false}
     >
       <Modal.Header closeButton>
         <Modal.Title>{t('startZoom.3','Eliminar')} {props.meetingTitle} {t('startZoom.4','a las')} {props.meetingTime}</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         {t('startZoom.5','¿Deseas borrar esta clase de tu programa mensual? La clase se dejará de agendar de manera recurrente cada mes.')}
       </Modal.Body>
       <Modal.Footer>
         <Button variant="secondary" onClick={handleClose}>
           {t('startZoom.6','Cancelar')}
         </Button>
         <Button variant="danger" onClick={deleteMeeting}>{loading?<Spinner animation="border" />:'Borrar'}</Button>
       </Modal.Footer>
     </Modal>
    </div>
  )
}

export default DeleteZoomMeeting
