// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const now0 = new Date(Date.now()).toISOString()
const now1 = new Date(Date.now()+1800000).toISOString()
//const now0 = new Date(2021,0,5,19,30).toISOString()
//const now1 = new Date(2021,0,5,20,30).toISOString()
// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

let db = admin.firestore();

exports.scheduledFunction = functions.pubsub.schedule('every 30 minutes').onRun((context) => {
  db.collection('Sales').get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if(doc.data().data.startTime.startTime>=now0 && doc.data().data.startTime.startTime<now1){
              reminder = "<h3>¡Tu clase "+doc.data().data.claseData.title+" está por comenzar!</h3>"
                 +  "<p>Recuerda unirte a las "+doc.data().data.startTime.time+' a tu clase con '+doc.data().data.instructor.profileName+'.</p>'
                 +  "Haz click <a href="+'"'+doc.data().data.joinURL+'"'+">aquí</a> para unirte o entra a <a href="+' "https://moveme.fitness/ZoomClasses" '+">MoveMe</a>."

               db.collection('Mails').doc().set({
                 to:[doc.data().user.email],
                 message:{
                   subject:'Únete a tu clase '+doc.data().data.claseData.title,
                   html: reminder
                 }
               })

              console.log(doc.data().user.email)
            }
          })
          return console.log('Reminders sent')
      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
      });

      return null;
});
