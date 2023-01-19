import React, { useState } from 'react'
// import { Form } from 'react-router-dom';
import {db} from './../App'
import { collection, addDoc, updateDoc, where, getDocs, query } from "firebase/firestore";
// import UseHistory from './useHistory'
// import {Link} from 'react-router-dom'
import { useNavigate} from 'react-router-dom'

export default function Book() {
    const navigate = useNavigate()

    const [makingChanges, mChSet] = useState(false);
    const [pickDate, pickDateSet ] = useState(undefined);
    const xTimes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,];
    const [Slot, setSlot] = useState(undefined);
    const [MyName, setMyName] = useState(undefined);
    const [MyEmail, setMyEmail] = useState(undefined);
    let [timesNow, timesNowSet] = useState([]);

    let [s24X, s24XSet] = useState(false);
    let [s30X, s30XSet] = useState(false);


    return (
        <>
        <div className='bookings'>
            <input disabled={makingChanges} defaultValue={MyName} onChange={(e)=> setMyName(e.target.value) } type="text" name='name' placeholder='Full Name' />
                
            <input disabled={makingChanges} defaultValue={MyEmail} onChange={(e)=> setMyEmail(e.target.value) } type="email" name='email' placeholder='Email ID' />

            <h2>Choose Date & Time</h2>
            <input disabled={makingChanges} defaultValue={pickDate} min={new Date().toISOString().split('T')[0]} onChange={(e)=> {
                pickDateSet(e.target.value); 
                startTimes(e.target.value);
                setSlot(undefined);
                } } type="date" name='date' />

            <div className='picker'>
            { pickDate ? xTimes.map(x => {return timesNow.includes(x) ? "": <button className={Slot === x ? "active":""} onClick={ (e) =>{ setSlot(x)} }  key={x} >{x> 9 ? x:'0'+x}:00 to {x+1}:00 
            <span className='divide'></span>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill={Slot !== x ?"#eeeeee":"#ffffff"}>
                <path d={ Slot === x ?
                    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z' :
                    'M12,2C6.47,2,2,6.47,2,12c0,5.53,4.47,10,10,10s10-4.47,10-10C22,6.47,17.53,2,12,2z M12,20c-4.42,0-8-3.58-8-8 c0-4.42,3.58-8,8-8s8,3.58,8,8C20,16.42,16.42,20,12,20z'
                }/>
                </svg></button>}) : '' }
            <p className='slot'>{ !pickDate ? '':'No Slots Left'}</p>
            </div>
            <button className='bookMe' disabled={makingChanges} onClick={() => bookMeet()}>Book Meeting</button>
        </div>

        </>
    )

    function addMin(d, m) {
        var result = new Date(d);
        result.setMinutes(result.getMinutes() + m);
        return result;
    }

    function bookMeet(){
        if(!pickDate || !MyName || !MyEmail || !validateEmail( MyEmail) || (!Slot && (Slot !== 0))){
            console.log("Fill Data Properly");
            alert("Fill Data Properly")
        }else{
            // console.log("do It", pickDate, Slot)
            let timeN = new Date();
            // timeN.setHours(0)
            // timeN = timeN.getTimezoneOffset()
            timeN.setMinutes(0)
            timeN.setSeconds(0)
            let timeS = new Date(pickDate);
            // timeS = timeS.getTimezoneOffset();
            timeS.setHours(Slot)
            timeS.setMinutes(0)
            // timeS.setTime((Slot > 9 ? Slot:"0"+Slot)+":00")
            mChSet(true)
            let data = {
                id:"", tz:"IST",
                dateX: pickDate, timeX: Slot,
                s24:!s24X && (addMin(timeN, 60 * 10) < timeS), s30: !s30X && (addMin(timeN, 30) < timeS), s5:(addMin(timeN, 5) < timeS),
                startTime: timeS, canceled: false,
                MyName, MyEmail, meet:"",
                email:"mainlandsea@gmail.com",
            }
            // console.log(data)

            try {
                addDoc(collection(db, "calXevents"), {
                  id:"",  ...data
                }).then((ref) => {
                  updateDoc(ref, {id:ref.id});
                  navigate('/modify/' + ref.id)
                  console.log("Document written!");
                });
              } catch (e) {
                console.error("Error adding document: ", e);
              }
            
        }
    }

    function validateEmail(email){
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (email.match(validRegex)) {
            return true;
        }else{
            return false;
        }
    }

    function startTimes(d){
        console.log(d)
        timesNowSet([])
        let c = []
        try{

        const p = getDocs(query(collection(db, "calXevents"), where( "dateX", "==",  pickDate )) )
            p.then((querySnapshot)=>{               
                const newData = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
                    console.log(newData)
                newData.forEach(i => {
                    c.push(i.timeX)
                    if(newData.length === c.length){
                        timesNowSet(c)
                    }
                    return i;
                })
                // mySet(newData)
                return newData;
        })

        }catch(err){
            console.log(err)
        }
        
    }

}