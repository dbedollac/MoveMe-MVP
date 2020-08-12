import React,{useContext,useEffect,useState} from 'react'
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext"
import CardSaved from '../Cards/CardSaved'
import Purchases from '../Cards/Purchases'
import {db,auth} from '../../Config/firestore'
import { withRouter } from "react-router";
import './MisCompras.css'

function MisCompras(props) {
  const { usuario } = useContext(Auth);
  const [purchases,setPurchases] = useState([])
  const [showMore, setshowMore] = useState(10)

  const handleVerMas = () =>{
    setshowMore(showMore + 10)
  }

  const sortPurchases = (a,b) => {
    const meetingA = a.date;
    const meetingB = b.date;

    let comparison = 0;
    if (meetingA > meetingB) {
      comparison = -1;
    } else if (meetingA < meetingB) {
      comparison = 1;
    }
    return comparison;
  }

  useEffect(()=>{
    auth.onAuthStateChanged((usuario) => {
      if (usuario===null) {
          props.history.push("/market");
      }
    })

    if (usuario) {
      var Purchases = []
      db.collection('Sales').where('user.uid','==',usuario.uid).get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                Purchases.push(doc.data())
              })
              setPurchases(Purchases)
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          });
    }
  },[usuario])

  return(
    <div>
      <Header  user={usuario?true:false}/>
      <div className='MisCompras-container d-flex flex-column pt-2 align-items-center'>
        <div className='MisCompras-container-paymentMethod col-6 rounded p-1'>
          <CardSaved/>
        </div>
        {purchases?purchases.sort(sortPurchases).slice(0,showMore).map(purchase => (
          <div className='col-6 mt-2'>
            <Purchases
              expire={new Date(purchase.expire)}
              date={new Date(purchase.date)}
              type= {purchase.type}
              startTime ={purchase.type.includes('Zoom')?purchase.data.startTime:null}
              claseData={purchase.data.claseData}
              instructor={purchase.data.instructor}
            />
          </div>
        )):null}
        {purchases.length>showMore?<button className='btn-secondary rounded col-4 my-2' onClick={handleVerMas}>Ver más</button>:null}
      </div>
    </div>
  )
}

export default withRouter(MisCompras)
