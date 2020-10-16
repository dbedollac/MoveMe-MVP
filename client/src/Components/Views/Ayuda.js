import React,{useState,useEffect,useContext} from 'react'
import { withRouter } from "react-router";
import { Auth } from "../../Config/AuthContext";
import Header from '../Molecules/Header'
import { useTranslation } from 'react-i18next';
import Documentation from './Documentation'
import {EnvelopeFill, ArchiveFill} from 'react-bootstrap-icons';
import './Ayuda.css'

function Ayuda(props) {
  const { usuario } = useContext(Auth);
  const { t } = useTranslation();

  return (
    <>
    <Header empty={usuario?true:false}/>
      <div className='Ayuda-container p-4'>
        <h4>{t('help.1','Hola')}</h4>

        <div className='d-flex flex-row'>
          <EnvelopeFill className='Ayuda-icono' size={'2em'}/>
          <h5 className='pt-1 px-2'>{t('help.2','Email Support:')}</h5>
          <a href='mailto:ayuda@moveme.fitness' className='pt-1'>{t('help.6')}</a>
        </div>
        <p>{t('help.3','Escríbenos')}</p>

        <div className='d-flex flex-row'>
          <ArchiveFill className='Ayuda-icono' size={'2em'}/>
          <h5 className='pt-1 px-2'>{t('help.4')}</h5>
          <a target="_blank" href='https://www.facebook.com/MoveMe-Fitness-107603050964291' className='pt-1'>{t('help.6')}</a>
        </div>
        <p>{t('help.5','Escríbenos')}</p>

        <Documentation empty={true}/>
      </div>
    </>
  )
}

export default withRouter(Ayuda)
