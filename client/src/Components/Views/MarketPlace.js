import React, {useState,useEffect,useContext} from 'react';
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext";
import {db, auth} from '../../Config/firestore'
import { withRouter } from "react-router";
import './MarketPlace.css'

function MarketPlace(props) {
  const { usuario } = useContext(Auth);

  useEffect(()=>{
    if (props.return) {
      if (props.return.includes('coach')) {
        props.history.push(props.return)
      }
    }

    if (props.location.state) {
      if (props.location.state[0].includes('coach')) {
        props.history.push(props.location.state[0])
      }
    }

  })

    return (
      <div>
        <Header  user={usuario?true:false}/>
        {console.log(usuario)}
        <div className='MarketPlace-container'>
        </div>
      </div>
    )

}

export default withRouter(MarketPlace)
