import React, { useState, useContext, useEffect } from "react";
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import {Redirect} from "react-router-dom";
import {auth} from '../../Config/firestore'
import ChooseUserType from './ChooseUserType'
import InstructorProfile from './InstructorProfile'
import MarketPlace from './MarketPlace'
import queryString from 'query-string'
import {zoomID, zoomSecret, zoomRedirectURL} from '../../Config/ZoomCredentials'
import {db} from '../../Config/firestore'
import {proxyurl} from '../../Config/proxyURL'
import RefreshToken from '../Atoms/RefreshToken'

function Dashboard(props) {
const { usuario } = useContext(Auth);
const [nombre, setNombre] = useState(null);
const [instructor, setInstructor] = useState(false);
const [user, setUser] = useState(false);


useEffect(()=>{
  let user = usuario;
  user?user.displayName? setNombre(user.displayName):setNombre(user.email):setNombre(null)

  auth.onAuthStateChanged((user) => {
    if (user===null) {
        props.history.push("/market");
    }
  })

  if (usuario) {
  const parsed = queryString.parse(props.location.search);
  if (parsed.code) {

    let url='zoomAPI/get-token'

    fetch(proxyurl+url,
    {method: 'POST',
      body: JSON.stringify({
           zoomRedirectURL: zoomRedirectURL,
           parsedcode: parsed.code,
           zoomID: zoomID,
           zoomSecret: zoomSecret
       }),
       headers: {
         "content-type": "application/json"
       }
    }).then((response)=>{
        Promise.resolve(response.json()).then( (resp) =>{
          if(resp.access_token){

            fetch(proxyurl+'zoomAPI/get-user',
            {method: 'POST',
              body: JSON.stringify({
                   token: resp.access_token
               }),
               headers: {
                 "content-type": "application/json"
               }
            }).then((response)=>{
                Promise.resolve(response.json()).then( (resp2) =>{
                  db.collection("Instructors").doc(usuario.uid).set({
                    zoomToken: resp.access_token,
                    zoomRefreshToken: resp.refresh_token,
                    zoomUserID: resp2.id,
                    zoomAccountID: resp2.account_id
                  },{ merge: true })
                })
              }).catch((error)=>{
                console.log(error);
              })

          }
        }
        )
    }).catch((error)=>{
      console.log(error);
    })
  }

    var docRef = db.collection("Instructors").doc(usuario.uid);
    docRef.get().then((doc)=>{
    if (doc.exists) {
        parsed.code?console.log('Cuenta Zoom recién enlazada'):RefreshToken(usuario.uid,doc.data().zoomRefreshToken)
        setInstructor(true)
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

    var docRef = db.collection("Users").doc(usuario.uid);
    docRef.get().then((doc)=>{
    if (doc.exists) {
        setUser(true)
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  }
},[usuario])


    if ((!instructor&&!user)||(instructor&&user)) {
      return <ChooseUserType return={props.location.state?props.location.state[0]:''}/>
    }else {
      if (instructor) {
        return <Redirect to='instructor-profile' />
      }else {
        return <MarketPlace return={props.location.state?props.location.state[0]:''}/>
      }
    }

}

export default withRouter(Dashboard);
