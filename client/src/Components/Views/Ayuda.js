import React,{useState,useEffect,useContext} from 'react'
import { withRouter } from "react-router";
import { Auth } from "../../Config/AuthContext";
import Header from '../Molecules/Header'
import { useTranslation } from 'react-i18next';
import Documentation from './Documentation'
import './Ayuda.css'

function Ayuda(props) {
  const { usuario } = useContext(Auth);
  const { t } = useTranslation();

  return (
    <>
    <Header empty={usuario?true:false}/>
      <div className='Ayuda-container p-4'>
        <p className='Ayuda-container-contact'>{t('help.1','Hola')}, <strong>{t('help.2','escríbenos a ')}<a href='mailto:ayuda@moveme.fitness'>ayuda@moveme.fitness</a></strong>{t('help.3',' y en cuanto nuestro próximo agente se encuentre disponible te responderá de inmediato.')}
          <br/>
          <br/>{t('help.4','Danos una descripción del problema o duda que presentas.')}
          <br/>
          <br/>{t('help.5','Te pido de favor nos escribas desde el correo electrónico que registraste en la plataforma.')}
        </p>
        <Documentation empty={true}/>
      </div>
    </>
  )
}

export default withRouter(Ayuda)
