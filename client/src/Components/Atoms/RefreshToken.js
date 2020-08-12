import {zoomID, zoomSecret,zoomRedirectURL} from '../../Config/ZoomCredentials'
import {db} from '../../Config/firestore'
import {corsurl,proxyurl} from '../../Config/proxyURL'

function RefreshToken(uid, refreshtoken, token) {

  const requestUserAuthorization = () =>{
    window.location.href = 'https://zoom.us/oauth/authorize?response_type=code&client_id='+zoomID+'&redirect_uri='+zoomRedirectURL
  }

  fetch(proxyurl+"zoomAPI/check-token",
    {
    method: 'POST',
    body: JSON.stringify({
         token: token
     }),
     headers: {
       "content-type": "application/json"
     }
   }).then((response)=>{
        Promise.resolve(response.json()).then( (resp) =>{
          if (resp.code?resp.code!==124?true:false:false) {
              console.log('Token vigente');
          } else {

    var newTokens = null

    let url='https://zoom.us/oauth/token?grant_type=refresh_token&refresh_token='+refreshtoken
    let header = "Basic "+ btoa(zoomID+':'+zoomSecret)

    fetch(corsurl+url,
    {method: 'POST',
    headers:{
      "Authorization": header
    }
    }).then((response)=>{
        Promise.resolve(response.json()).then( (resp) =>{
          if (resp.access_token) {
            db.collection("Instructors").doc(uid).set({
              zoomToken: resp.access_token,
              zoomRefreshToken: resp.refresh_token
            },{ merge: true }).then(console.log('Tokens refresheados')).catch((error)=>{
              console.log(error);
            })
          }else {
            requestUserAuthorization()
          }
        }
        )
    }).catch((error)=>{
      console.log(error);
    })
  }}

  )}
  )
}

export default RefreshToken
