import React,{useContext,useEffect,useState} from 'react'
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext"
import {db,auth} from '../../Config/firestore'
import { withRouter } from "react-router";
import {Table, Collapse} from 'react-bootstrap'
import {ChevronCompactUp,ChevronCompactDown, InfoCircleFill} from 'react-bootstrap-icons'
import {UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap'
import { useTranslation } from 'react-i18next';
import './Sales.css'

function Sales(props) {
  const { usuario } = useContext(Auth);
  const [sales,setSales] = useState([])
  const [clases,setClases] = useState([])
  const [openRetos, setOpenRetos] = useState(false);
  const [openZoom, setOpenZoom] = useState(false);
  const [openVideos, setOpenVideos] = useState(false);
  const today = new Date()
  const [sinceDate,setsinceDate] = useState(new Date(today.getTime()-(24*7 * 60 * 60 * 1000)))
  const { t } = useTranslation();

  const sortSales = (a,b) => {
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

  const getDate = (date,reto) => {
    var saleDate = new Date(date)
    var days = saleDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
    var month = (saleDate.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
    var year = saleDate.getFullYear()

    if (reto) {
      return(days+'/'+month+'/'+year)
    } else {
      return(year+'-'+month+'-'+days)
    }
  }

  const handlesinceDate = (event) =>{
    setsinceDate(new Date(event.target.value.replace(/-/g, '\/')))
  }

  useEffect(()=>{
    auth.onAuthStateChanged((usuario) => {
      if (usuario===null) {
          props.history.push("/market");
      }
    })

    if (usuario) {

      var Sales = []
      db.collection('Sales').where('instructor.uid','==',usuario.uid).get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                Sales.push(doc.data())
              })
              setSales(Sales.filter(item=>item.date>=sinceDate.toISOString()))
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          });

      var Clases = []
      db.collection('Instructors').doc(usuario.uid).collection('Classes').get()
              .then(function(querySnapshot) {
                  querySnapshot.forEach(function(doc) {
                    Clases.push(doc.data())
                  })
                  setClases(Clases)
              })
              .catch(function(error) {
                  console.log("Error getting documents: ", error);
              });

      setSales(sales.filter(item=>item.date>=sinceDate.toISOString()))
    }
  },[usuario,sinceDate])

  return (
    <div>
      <Header instructor={true}/>
        <div className='Sales-container pb-2'>

          <div className='d-flex flex-row align-items-center justify-content-start pl-2 pt-2'>
            <h3>{t('sales.1','Ventas desde')}</h3>
            <input type='date' className='ml-3 rounded' max={getDate(today,false)} value={getDate(sinceDate,false)} onChange={handlesinceDate} />
          </div>

          <Table striped bordered hover className='Sales-totales'>
              <thead>
                <tr>
                  <th>{t('sales.2','Tipo de Venta')}</th>
                  <th>{t('sales.3','Cantidad')}</th>
                  <th>{t('sales.4','Monto')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t('sales.5','Reto Mensual')}</td>
                  <td>{sales.length>0?sales.filter(item=>item.type.includes('Reto')).length:0}</td>
                  <td>${sales.length>0?sales.filter(item=>item.type.includes('Reto')).reduce((a,b)=>{return a+b.price},0).toFixed(2):0}</td>
                </tr>
                <tr>
                  <td>{t('sales.6','Clases por Zoom (Pagos por asistencia)')}</td>
                  <td>{sales.length>0?sales.filter(item=>item.type.includes('Zoom')).length:0}</td>
                  <td>${sales.length>0?sales.filter(item=>item.type.includes('Zoom')).reduce((a,b)=>{return a+b.price},0).toFixed(2):0}</td>
                </tr>
                <tr>
                  <td>{t('sales.7','Renta de Videos')}</td>
                  <td>{sales.length>0?sales.filter(item=>item.type.includes('Video')).length:0}</td>
                  <td>${sales.length>0?sales.filter(item=>item.type.includes('Video')).reduce((a,b)=>{return a+b.price},0).toFixed(2):0}</td>
                </tr>
                <tr>
                  <td>{t('sales.8','Devoluciones')}</td>
                  <td>{sales.length>0?sales.filter(item=>item.refund===true).length:0}</td>
                  <td>-${sales.length>0?sales.filter(item=>item.refund===true).reduce((a,b)=>{return a+b.price},0).toFixed(2):0}</td>
                </tr>
                <tr>
                  <td colSpan='2'><i><strong>Total</strong></i></td>
                  <td><i><strong>${sales.length>0?sales.filter(item=>item.refund===false).reduce((a,b)=>{return a+b.price},0).toFixed(2):0}</strong></i></td>
                </tr>
              </tbody>
            </Table>

          <div className='card mx-1 px-3 py-2 RetoSales-detail'>
            <div className='d-flex flex-row justify-content-between align-items-center '>
              <h5 className='mr-4'>{t('sales.12','Ventas de Reto Mensual')}</h5>
              {openRetos?<ChevronCompactUp onClick={() => setOpenRetos(!openRetos)} style={{cursor:'pointer'}} size={'2em'}/>
              :<ChevronCompactDown onClick={() => setOpenRetos(!openRetos)} style={{cursor:'pointer'}} size={'2em'}/>}
            </div>

            <Collapse in={openRetos}>
              <Table bordered hover striped className='Sales-detalle' responsive>
                  <thead>
                    <tr>
                      <th>{t('sales.13','Cliente')}</th>
                      <th>{t('sales.14','Precio pagado')}</th>
                      <th>{t('sales.15','Fin del reto')}</th>
                      <th>{t('sales.16','Estatus')}</th>
                    </tr>
                  </thead>
                  <tbody>
                  {sales.length>0?sales.filter(item=>item.type.includes('Reto')).sort(sortSales).map((reto,index) => (
                    <tr key={reto.user.uid+reto.instructor.uid+index}>
                      <td>{reto.user.email}</td>
                      <td>${reto.price}</td>
                      <td>{getDate(reto.expire,true)}</td>
                      <td>{reto.refund?<i>{t('sales.17','Devolución a cliente')}</i>:<i>{t('sales.11','Pagado')}</i>}</td>
                    </tr>
                  )):null}

                  </tbody>
                </Table>
              </Collapse>
            </div>

            <div className='card mt-3 mx-1 px-3 py-2 ZoomSales-detail'>
              <div className='d-flex flex-row justify-content-between align-items-center '>
                <h5 className='mr-4'>{t('sales.18','Ventas de Clases por Zoom')}</h5>
                {openZoom?<ChevronCompactUp onClick={() => setOpenZoom(!openZoom)} style={{cursor:'pointer'}} size={'2em'}/>
                :<ChevronCompactDown onClick={() => setOpenZoom(!openZoom)} style={{cursor:'pointer'}} size={'2em'}/>}
              </div>

              <Collapse in={openZoom}>
                <Table bordered hover striped className='Sales-detalle' responsive >
                    <thead>
                      <tr>
                        <th>{t('sales.19','Clase')}</th>
                        <th>{t('sales.20','Pagos por asistencia')}</th>
                        <th>{t('sales.21','Clases prueba')}</th>
                        <th>{t('sales.22','Devoluciones')}</th>
                        <th>{t('sales.4','Monto')}</th>
                      </tr>
                    </thead>
                    <tbody>
                    {clases.length>0?clases.map((clase,index) => (
                      <tr key={clase.title+index}>
                        <td>{clase.title}</td>
                        <td>{sales.filter(item=>item.type.includes('Zoom')).filter(item=>item.data.claseData.title===clase.title).filter(item=>item.price>0).length}</td>
                        <td>{sales.filter(item=>item.type.includes('Zoom')).filter(item=>item.data.claseData.title===clase.title).filter(item=>item.price===0).length}</td>
                        <td>{sales.filter(item=>item.type.includes('Zoom')).filter(item=>item.data.claseData.title===clase.title).filter(item=>item.refund===true).length}</td>
                        <td>${sales.filter(item=>item.type.includes('Zoom')).filter(item=>item.data.claseData.title===clase.title).filter(item=>item.refund===false).reduce((a,b)=>{return a+b.price},0).toFixed(2)}</td>
                      </tr>
                    )):null}

                    </tbody>
                  </Table>
                </Collapse>
              </div>

              <div className='card mt-3 mx-1 px-3 py-2 VideoSales-detail'>
                <div className='d-flex flex-row justify-content-between align-items-center '>
                  <h5 className='mr-4'>{t('sales.7','Renta de Videos')}</h5>
                  {openVideos?<ChevronCompactUp onClick={() => setOpenVideos(!openVideos)} style={{cursor:'pointer'}} size={'2em'}/>
                  :<ChevronCompactDown onClick={() => setOpenVideos(!openVideos)} style={{cursor:'pointer'}} size={'2em'}/>}
                </div>

                <Collapse in={openVideos}>
                  <Table bordered hover striped className='Sales-detalle' responsive>
                      <thead>
                        <tr>
                          <th>{t('sales.19','Clase')}</th>
                          <th>{t('sales.23','Rentas')}</th>
                          <th>{t('sales.4','Monto')}</th>
                        </tr>
                      </thead>
                      <tbody>
                      {clases.length>0?clases.filter(item=>item.videoURL).map((clase,index) => (
                        <tr key={clase.title+index}>
                          <td>{clase.title}</td>
                          <td>{sales.filter(item=>item.type.includes('Video')).filter(item=>item.data.claseData.title===clase.title).length}</td>
                          <td>${sales.filter(item=>item.type.includes('Video')).filter(item=>item.data.claseData.title===clase.title).reduce((a,b)=>{return a+b.price},0).toFixed(2)}</td>
                        </tr>
                      )):null}

                      </tbody>
                    </Table>
                  </Collapse>
                </div>

          </div>
    </div>
  )
}

export default withRouter(Sales)
