import React,{useContext,useEffect,useState} from 'react'
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext"
//import CardSaved from '../Cards/CardSaved' Agregar una vez que se habiliten los pagos automáticos
import Purchases from '../Cards/Purchases'
import {db,auth} from '../../Config/firestore'
import { withRouter } from "react-router";
import { useTranslation } from 'react-i18next';
import './MisCompras.css'

function MisCompras(props) {
  const { usuario } = useContext(Auth);
  const [purchases,setPurchases] = useState([])
  const [showMore, setshowMore] = useState(10)
  const [refundsNum,setrefundsNum] = useState(0)
  const { t } = useTranslation();

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
                Purchases.push({data:doc.data(),id:doc.id})
              })
              setPurchases(Purchases)
              setrefundsNum(Purchases.filter(item => item.data.refund===true).length)
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
        <h3 className='align-self-start pl-3'>{t('misCompras.24','Mis Compras')}</h3>
        {purchases.length>0?purchases.sort(sortPurchases).slice(0,showMore).map((purchase,index) => (
          <div className='col-12 col-md-10 mt-2' key={purchase.id}>
            <Purchases
              expire={new Date(purchase.data.expire)}
              date={new Date(purchase.data.date)}
              type= {purchase.data.type}
              startTime ={purchase.data.type.includes('Zoom')?purchase.data.data.startTime:null}
              claseData={purchase.data.data.claseData}
              instructor={purchase.data.data.instructor}
              price={purchase.data.price}
              paymentID={purchase.data.paymentID}
              paymentAmount={purchase.data.paymentAmount}
              refund={purchase.data.refund}
              refundsNum={refundsNum}
              id={purchase.id}
            />
          </div>
        )):<h4 style={{color:'gray'}} className='text-center py-5'><i>{t('misCompras.1','No hay compras registradas en los últimos 6 meses')}</i></h4>}
        {purchases.length>showMore?<button className='btn-secondary rounded col-4 my-2' onClick={handleVerMas}>Ver más</button>:null}
      </div>
    </div>
  )
}

export default withRouter(MisCompras)
