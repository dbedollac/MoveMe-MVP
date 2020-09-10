import React,{useContext} from 'react'
import { TrashFill } from 'react-bootstrap-icons';
import {storage, db} from "../../Config/firestore.js"
import { Auth } from "../../Config/AuthContext"
import * as firebase from 'firebase'
import { Spinner} from 'react-bootstrap'

function DeleteStorage(props) {
  const { usuario } = useContext(Auth);

  const deleteResource = async () =>{
    await storage.ref(props.type).child(props.name)
    .delete().then(function() {
      console.log('deleted')
    }).catch(function(error) {
      console.log(error)
    })

    if (props.profile) {
      await db.collection('Instructors').doc(usuario.uid).update({
        imgURL: firebase.firestore.FieldValue.delete()
      })
    } else {
      if (props.type==='Pictures') {
        await db.collection('Instructors').doc(usuario.uid).collection('Classes').doc(props.claseID).update({
          imgURL: firebase.firestore.FieldValue.delete()
        })
      } else {
        await db.collection('Instructors').doc(usuario.uid).collection('Classes').doc(props.claseID).update({
          videoURL: firebase.firestore.FieldValue.delete()
        })
      }
    }
  }

  return(
    <div>
      <TrashFill onClick={deleteResource} style={{cursor:'pointer'}} size={'20px'}/>
    </div>
  )
}

export default DeleteStorage
