import React,{useContext,useState,useEffect} from 'react'
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext"
import {db} from '../../Config/firestore'
import MarketAllClasses from './MarketAllClasses'
import './MisVideos.css'

function MisVideos() {
  const { usuario } = useContext(Auth);
  const [retoClases,setretoClases] = useState(null)
  const [videoClases,setvideoClases] = useState(null)

  const handlePurchases = async (purchase) =>{
    var Clases = []

    if (purchase.expire>new Date().toISOString()) {

      if (purchase.type.includes('Reto')) {

         await db.collection("Instructors").doc(purchase.instructor.uid)
                             .collection('Classes')
                                            .get()
                                            .then((querySnapshot) => {
                                                querySnapshot.forEach((doc) => {
                                                  if (doc.data().videoURL!==undefined) {
                                                    Clases.push({instructor:{id:purchase.instructor.uid,data:purchase.data.instructor},id:doc.id, data: doc.data()});
                                                  }
                                                });
                                            })
                                            .catch(function(error) {
                                                console.log("Error getting documents: ", error);
                                            })
      }
    }
      setretoClases(Clases)

  }

  useEffect(()=>{
    if (usuario) {
      db.collection('Sales').where('user.uid','==',usuario.uid).get().then((querySnapshot)=>{
        var Videos=[]
        querySnapshot.forEach((doc)=>{
          if (doc.data().expire>new Date().toISOString()) {
            if (doc.data().type.includes('Video')) {
              Videos.push({instructor:{id:doc.data().instructor.uid,data:doc.data().data.instructor},id:doc.id, data: doc.data().data.claseData})
            }
        }
          handlePurchases(doc.data())
        })
        setvideoClases(Videos)
      }).catch(error => console.log(error))


    }

  },[usuario])

  return(
    <div>
      <Header  user={usuario?true:false}/>
      <div className='MisVideos-container'>
        <MarketAllClasses allClases={retoClases&&videoClases?retoClases.concat(videoClases):null} array={retoClases&&videoClases?retoClases.concat(videoClases):null}/>
      </div>
    </div>
  )
}

export default MisVideos
