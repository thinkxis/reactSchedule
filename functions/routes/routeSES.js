// Email
const express = require("express");
// const errors = require("./src/errors");

// IMPORTS
const nodemailer = require('nodemailer');

const routeSES = express.Router();
// INASELIZE


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: true,
    auth: {
      user: 'mainlandsea@gmail.com',
      pass: 'uackxnzucmztrffc'
    },
});

const enviroment = require("./../env");
const request = require('request-promise');
const functions = require("firebase-functions");
const admin = require('firebase-admin');

const YOUR_SERVER = enviroment.production ? enviroment.YOUR_SERVER_PROD : enviroment.YOUR_SERVER;
const YOUR_CLIENT = enviroment.production ? enviroment.YOUR_CLIENT_PROD : enviroment.YOUR_CLIENT;



routeSES.post("/sendSES/:countryCode",(req, res) => { // Route for ...

    if(!req.params.countryCode || 
      !req.body.to ||
      !req.body.sub || !req.body.txt
      ){
        res.json({ 
            success:false, status:200, //http
            // code:errors.Forbidden, //route
            data:null, info:"Please post valid data"
        });
    }else{
        const mailOptions = {
          from: req.body.by || 'no-reply@frycold.com',
          to: req.body.to,
          subject: req.body.sub,
          html: req.body.txt
        };
        // res.json({success:true})

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    // console.log(error);        
    res.json({ 
        success:false, status:200, //http
        // code:errors.Forbidden, //route
        data:null, info:error
    });
  } else {
    // console.log('Email sent: ' + info.response);
    res.json({
        success:true, status:200, 
        // code: errors.ok, 
        data:{}, info:'Email sent: ' + info.response
    });
  }
});

    }
  
});

routeSES.get("**",(req, res) => { // Route for ...
    res.json({success:false, info:"Invalid Get Call"});
});
routeSES.post("**",(req, res) => { // Route for ...
    res.json({success:false, info:"Invalid Post Call"});
});
routeSES.put("**",(req, res) => { // Route for ...
    res.json({success:false, info:"Invalid Put Call"});
});
routeSES.delete("**",(req, res) => { // Route for ...
    res.json({success:false, info:"Invalid Delete Call"});
});


function addMin(d, m) {
  // let d = new Date('Fri Jan 13 2023 00:00:00');
  var result = new Date(d);
  console.log(result)
  result.setMinutes(result.getMinutes() + m);
  console.log(result)
  return result;
}


function getSINemail(o){
  return `
  <div style="background: #fafafa; width: 100%; text-align: center; padding: 0 0 24px 0;
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">
  <img style="height:80px; margin:8px auto;" src="https://firebasestorage.googleapis.com/v0/b/test-dipesh.appspot.com/o/logo192.png?alt=media&token=81a697bd-5f32-4aae-8045-b8b2490970a6" />
  <p style="    background: #ffffff;
  line-height: 20px;
  font-size: 14px;
  padding: 24px 8px;
  margin: 0 auto;
  width: 90%;
  max-width: 320px;">UTC 
    ${
    new Date(o.startTime.toDate()).getDate()
    }-${
    new Date(o.startTime.toDate()).getMonth()
    }-${
    new Date(o.startTime.toDate()).getFullYear()
    } ${
      o.startTime ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(o.startTime.toDate()).getDay()] : ""
    } ${ 
      new Date(o.startTime.toDate()).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) 
    }<br>A new event has been scheduled.</p>
  </div>
  `
}

function get24Hemail(o){
  return `
  <div style="background: #fafafa; width: 100%; text-align: center; padding: 0 0 24px 0;
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">
  <img style="height:80px; margin:8px auto;" src="https://firebasestorage.googleapis.com/v0/b/test-dipesh.appspot.com/o/logo192.png?alt=media&token=81a697bd-5f32-4aae-8045-b8b2490970a6" />
  <p style="    background: #ffffff;
  line-height: 20px;
  font-size: 14px;
  padding: 24px 8px;
  margin: 0 auto;
  width: 90%;
  max-width: 320px;">UTC ${
    new Date(o.startTime.toDate()).getDate()
    }-${
    new Date(o.startTime.toDate()).getMonth()
    }-${
    new Date(o.startTime.toDate()).getFullYear()
    } ${
      o.startTime ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(o.startTime.toDate()).getDay()] : ""
    } ${ 
      new Date(o.startTime.toDate()).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) 
    }<br>Your scheduled meeting will start in 24 hours.</p>
  </div>
  `
}

function get30Memail(o){
  return `
  <div style="background: #fafafa; width: 100%; text-align: center; padding: 0 0 24px 0;
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">
  <img style="height:80px; margin:8px auto;" src="https://firebasestorage.googleapis.com/v0/b/test-dipesh.appspot.com/o/logo192.png?alt=media&token=81a697bd-5f32-4aae-8045-b8b2490970a6" />
  <p style="    background: #ffffff;
  line-height: 20px;
  font-size: 14px;
  padding: 24px 8px;
  margin: 0 auto;
  width: 90%;
  max-width: 320px;">UTC ${
    new Date(o.startTime.toDate()).getDate()
    }-${
    new Date(o.startTime.toDate()).getMonth()
    }-${
    new Date(o.startTime.toDate()).getFullYear()
    } ${
      o.startTime ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(o.startTime.toDate()).getDay()] : ""
    } ${ 
      new Date(o.startTime.toDate()).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) 
    }<br>Your scheduled meeting will start in 30 minutes.</p>
  </div>
  `
}

module.exports = {
  ROUT: routeSES,
  addMin, 
  get30Memail,
  get24Hemail,
  getSINemail,
};



