import {zoomID, zoomSecret} from '../../Config/ZoomCredentials'
import {db} from '../../Config/firestore'
import {corsurl} from '../../Config/proxyURL'

function RefreshToken(email, token) {

  var newTokens = null

  let url='https://zoom.us/oauth/token?grant_type=refresh_token&refresh_token='+token
  let header = "Basic "+ btoa(zoomID+':'+zoomSecret)

  fetch(corsurl+url,
  {method: 'POST',
  headers:{
    "Authorization": header
  }
  }).then((response)=>{
      Promise.resolve(response.json()).then( (resp) =>{
        db.collection("Instructors").doc(email).set({
          zoomToken: resp.access_token,
          zoomRefreshToken: resp.refresh_token
        },{ merge: true })
        console.log('Tokens refresheados');
      }
      )
  }).catch((error)=>{
    console.log(error);
  })

}

export default RefreshToken
