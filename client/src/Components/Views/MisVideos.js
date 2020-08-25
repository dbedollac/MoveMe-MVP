import React,{useContext,useState,useEffect} from 'react'
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext"
import {db, auth} from '../../Config/firestore'
import MarketAllClasses from './MarketAllClasses'
import { withRouter } from "react-router";
import './MisVideos.css'

function MisVideos(props) {
  const { usuario } = useContext(Auth);
  const [retoClases,setretoClases] = useState([])
  const [videoClases,setvideoClases] = useState([])
  const [allClases,setclasesAll] = useState(null)

  const handlePurchases = async (purchase) =>{

    if (purchase.expire>new Date().toISOString()&&!purchase.refund) {

      if (purchase.type.includes('Reto')) {

         await db.collection("Instructors").doc(purchase.instructor.uid)
                             .collection('Classes')
                                            .get()
                                            .then((querySnapshot) => {
                                                querySnapshot.forEach((doc) => {
                                                  if (doc.data().videoURL!==undefined) {
                                                    retoClases.push({instructor:{id:purchase.instructor.uid,data:purchase.data.instructor},id:doc.id, data: doc.data(), expire:purchase.expire});
                                                  }
                                                })
                                            })
                                            .catch(function(error) {
                                                console.log("Error getting documents: ", error);
                                            })
      }
    }
    setclasesAll(retoClases.concat(videoClases))
  }

  useEffect(()=>{
    auth.onAuthStateChanged((usuario) => {
      if (usuario===null) {
          props.history.push("/market");
      }
    })

    if (usuario) {
      db.collection('Sales').where('user.uid','==',usuario.uid).get().then((querySnapshot)=>{
        var Videos=[]
        querySnapshot.forEach((doc)=>{
          if (doc.data().expire>new Date().toISOString()) {
            if (doc.data().type.includes('Video')) {
              Videos.push({instructor:{id:doc.data().instructor.uid,data:doc.data().data.instructor},id:doc.id, data: doc.data().data.claseData, expire:doc.data().expire})
            }
        }
          handlePurchases(doc.data())
        })
        setvideoClases(Videos)
      }).catch(error => console.log(error))
    }

  },[usuario,retoClases])

  return(
    <div>
      <Header  user={usuario?true:false}/>
      <div className='MisVideos-container'>
        <MarketAllClasses misVideos={true} allClases={retoClases.length>0||videoClases.length>0?retoClases.concat(videoClases):null} array={retoClases.length>0||videoClases.length>0?retoClases.concat(videoClases):null}/>
      </div>
    </div>
  )
}

export default withRouter(MisVideos)
