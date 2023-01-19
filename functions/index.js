const functions = require("firebase-functions");
const admin = require('firebase-admin');
const { google } = require("googleapis");
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const enviroment = require("./env");


const express = require('express');
const cors = require('cors');
const request = require('request-promise');

const routeSES = require('./routes/routeSES');

const app = express();
app.use(cors({ origin: true }));



// Your web app's Firebase configuration
admin.initializeApp(enviroment.firebaseConfig);
app.use('/api/SES', routeSES.ROUT);


const YOUR_SERVER = enviroment.production ? enviroment.YOUR_SERVER_PROD : enviroment.YOUR_SERVER;
const YOUR_CLIENT = enviroment.production ? enviroment.YOUR_CLIENT_PROD : enviroment.YOUR_CLIENT;


// function getAccessToken(oAuth2Client, callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   });
//   rl.question('Enter the code from that page here: ', code => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return callback(err);
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       try {
//         fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
//         console.log('Token stored to', TOKEN_PATH);
//       } catch (err) {
//         console.error(err);
//       }
//       callback(oAuth2Client);
//     });
//   });
// }

const oauth2Client = new google.auth.OAuth2('585852239023-h8tiepeootiv7vtnffehug567euvf7mt.apps.googleusercontent.com', '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');



app.get('/api/setMeet/:cc/:MeetID', async (req, res) => { // TESTING VOID
  if(!req.params.cc || !req.params.MeetID || !req.query.code){
    console.log("OLA")
    res.json({ 
      success:false, err:"Send all fields"
    })
  }else{
    const optionsX = {
      method: 'POST',
      uri: `https://oauth2.googleapis.com/token`,
      body: {
        code:req.query.code,
        client_id:"585852239023-h8tiepeootiv7vtnffehug567euvf7mt.apps.googleusercontent.com",
        client_secret:"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",
        grant_type:"authorization_code",
        redirect_uri:YOUR_SERVER + "/api/goMeet/IN?id=" + 1,

        // ...oauth2Client
      },
      json: true
    };
    request(optionsX).then((parsedBody) => {
      // console.log(parsedBody)

      // res.json({ 
      //   success:false, x:parsedBody
      // })

    
      if(!parsedBody){
        res.json({ 
          success:false, err:"Something went wrong..."
        })
      }else{

      oauth2Client.setCredentials({
        access_token: parsedBody.access_token,
        refresh_token: parsedBody.refresh_token,
        expiry_date: parsedBody.expires_in,
      });

      const x = admin.firestore().collection("calXevents").doc(req.params.MeetID)
      return x.get()
      .then(async refX => {
      const meet = refX.exists ? refX.data() : null;
      // console.log("daro", meet)

        if(!meet){
          res.json({ 
            success:false, err:"err", meet
          })

        }else{


  try{

      const calendar = google.calendar({ version: "v3", oauth2Client })
      let D = meet.startTime?.toDate();
      let nD = routeSES.addMin(D, 45)


      const event = {
        summary: "Meeting with " + meet.MyName,
        description: "The Big Day!",
        start: {
          dateTime: D,
          // timeZone: 'Asia/kolkata',
        },
        end: {
          dateTime: nD,
          // timeZone: 'Asia/Kolkata',
        },
        attendees: [
          {'email': meet.email},
          {'email': meet.MyEmail},
        ],
        conferenceData: {
            createRequest: {
                requestId: "sample123",
                conferenceSolutionKey: { type: "hangoutsMeet" },
            },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 10 },
          ],
        },
      };
      // We make a request to Google Calendar API.



      const u = await calendar.events.insert({
        auth: oauth2Client,
        calendarId: "primary",
        resource: event, 
        conferenceDataVersion: 1,
      })


        res.json({ 
          success:true, data:u
        })
      
      // u.then((event) =>  {
      //   console.log('Event created: %s', event.data)
      //   let conferenceId = event?.data?.conferenceData?.conferenceId;
      //   let entryPoints = event?.data?.conferenceData[0].uri;

      //   res.json({ 
      //     success:true, link:event?.data?.htmlLink, 
      //     conferenceId, entryPoints
      //   })
      // }).catch((error) => {
      //   console.log('Some error occured', error)

      //   res.json({ 
      //     success:false, err:error, x:"Some error occured"
      //   })
      // });

    }catch(err){
        console.log('Some error occured', error)

        res.json({ 
          success:false, err:error, x:"Some error occured"
        })
    }



        }

      })


      }


    })
    
    // .catch(err => {
    //   console.log(err)
    //   res.json({ 
    //     success:false, err, x:"iM"
    //   })
    // })
  }
})

app.get('/api/goMeet/:cc', async (req, res) => { // TESTING VOID
  if(!req.query.code || !req.params.cc || !req.query.id ){
    res.json({  success:false })
  }else{
    res.redirect(301, (YOUR_CLIENT + "/api-sign/brave" + req.query.id  +"/"+ encodeURIComponent( req.query.code )) )
  }
})

app.get('/api/add2Calander/:id', async (req, res) => { // TESTING VOID
    console.log("params", req.params.id)
    if(!req.params.id){
        res.json({ 
            success:false, status:200,
            data:null, info:"Invalid data!"
        });
        return;
    }else{
        const authUrl = await oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES
        });
        /* req.params.id can be handled differently for scale right now lets not waste time on it */
        newAge = authUrl + YOUR_SERVER + "/api/goMeet/IN?id=" + 1;
        console.log('Authorize this app by visiting this url:', (newAge));


      res.json({ 
          success:true, status:200,
          data: newAge, info:"OK data!"
      });

    }
})




exports.server_task = functions
    .region('us-central1')
    .runWith({})
    .https
    .onRequest(app);





//${ new Date(startTime?.toDate()).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}) }
exports.schedule = functions.pubsub.schedule('every 30 minutes').onRun((context) => {
    const collection30M_ID = "calXevents";
    const collection24H_ID = "calXevents";
    
    let D = new Date();
    // let D5 = routeSES.addMin(D, 5);
    let D30 = routeSES.addMin(D, 30);
    let D24 = routeSES.addMin(D, 10 * 60);
  
    // const x5M = admin.firestore().collection(collection30M_ID).where("s5","==",true).where("startTime", ">=",  D5 );
    const x30M = admin.firestore().collection(collection30M_ID).where("s30","==",true).where("startTime", ">=",  D30 );
    const x24H = admin.firestore().collection(collection24H_ID).where("s24","==",true).where("startTime", ">=",  D24 );
  
    const boy30 = x30M.get().then(ref => {
        
        if(ref.empty){
            return null;
        }else{
            var ctr = 0;
            return ref.forEach(doc => { 
              ctr++;
              const b = doc.data();
  
              const options = {
                method: 'POST',
                uri: `${YOUR_SERVER}/api/SES/sendSES/IN`,
                body: {
                    to:b.MyEmail,
                    sub:"You have a Meeting in 30 Minutes",
                    txt:routeSES.get30Memail( b.startTime.toDate() ),
                },
                json: true
              };
              let z = request(options).then(function(parsedBody) {
                console.log(parsedBody)
                if( !parsedBody || !parsedBody.success ){
                    return;
                }else{
                  const x30Mdoc = admin.firestore().collection(collection30M_ID).doc(b.id)
                  // console.log(parsedBody)
                  x30Mdoc.update({ act:false, sent:D })
                }
              })
  
              if (ctr === ref.size) {
                return null;
              }
            });
        }
    })
  
    const boy24 = x24H.get().then(ref => {
        
      if(ref.empty){
          return null;
      }else{
          var ctr = 0;
          return ref.forEach(doc => { 
            ctr++;
            const b = doc.data();
  
            const options = {
              method: 'POST',
              uri: `${YOUR_SERVER}/api/SES/sendSES/IN`,
              body: {
                  to:b.MyEmail,
                  sub:"You have a Meeting in 24 Hours",
                  txt:routeSES.get24Hemail( b.startTime.toDate() ),
              },
              json: true
            };
            request(options).then((parsedBody) => {
              console.log(parsedBody)
              if( !parsedBody || !parsedBody.success ){
                  return;
              }else{
                const x30Mdoc = admin.firestore().collection(collection24H_ID).doc(b.id)
                // console.log(parsedBody)
                x30Mdoc.update({ act:false, sent:D })
              }
            })
  
            if (ctr === ref.size) {
              return null;
            }
          });
      }
  })
  
  
    return boy30.then(() => {
      return boy24.then(() => {
        return null;
      })
    })
  
  
});


exports.createEvents = functions.firestore.document('calXevents/{id}').onCreate((snapshot, context) => {

  // Get an object with the current document value.
  // If the document does not exist, it has been deleted.
  const document = snapshot.exists ? snapshot.data() : null;

  const id = context?.params?.id;
  let user = document;

  // functions.logger.log("Mega: ", document, oldDocument, uid);
  if(!user){
    return; 
  }else{
    // add to calander
    // add meet link to firestore


    const options = {
      method: 'POST',
      uri: `${YOUR_SERVER}/api/SES/sendSES/IN`,
      body: {
        to:b.MyEmail,
        sub:"You have a Meeting in 30 Minutes",
        txt:routeSES.getSINemail( b.startTime.toDate() ),
    },
      json: true
  };

  return request(options).then(function(parsedBody) {
      if( !parsedBody || !parsedBody.success ){
          return;
      }else{
          return snapshot.ref.update({ sent1:true, meet:"" })
      }
  })
  
}
});
