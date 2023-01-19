import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import { db } from '../App';
import UseHistory from './useHistory';

const fetchCalendar = async (id) => {
const res = await fetch(`http://localhost:5001/test-dipesh/us-central1/server_task/api/add2Calander/${id}`);
//   const res = await fetch(`https://test-dipesh.web.app/api/add2Calander/${id}`);
  return res.json();
}

function ParamChild() {
    const navigate = useNavigate()

    const [makingChanges, mChSet ] = useState(false);
    const { id } = useParams();
    const [o, mySet] = useState(undefined);

    const [onChains, setOnChains] = useState(null);



    useEffect(()=>{
        setOnChains("OK")
        localStorage.setItem("MeetID", id)

        if (onChains !== null) {
        console.log("ola")
    const fetchPost = async () => {
        await getDoc(doc(db, "calXevents", id))
            .then((snapshot)=>{ 
                const newData = snapshot.exists ? snapshot.data() : null;
                mySet(newData)
                return newData;
        })
    }

    setTimeout(() => {
        fetchPost()
    }, 2000)
        }
    }, [onChains])


    return (
        <>
        <div className='Listing'>
            <table>
                <thead>
                <tr>
                    <th>Schudule</th>
                    <th className='line' colSpan={2}>About</th>
                </tr>
                </thead>
                
            <tbody>
                { o && o.id ? (<>
                <tr>
                    <td> {
                    new Date(o.startTime.toDate()).getDate()
                    }-{
                    new Date(o.startTime.toDate()).getMonth()
                    }-{
                    new Date(o.startTime.toDate()).getFullYear()
                    }<br/>{
                        o.startTime ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(o.startTime.toDate()).getDay()] : ""
                        } { new Date(o.startTime.toDate()).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) }</td>
                    <td>{o?.MyName}
                    <br/>Maharashtra, India.</td>
                    <td>{o.meet ? <a target="_blank" rel="noreferrer" href={o.meet}>Google Meet Link</a> : "..."}
                    <br/>
                        { o.canceled ? <b>Terminated</b> : ( (new Date()) < o.startTime.toDate() ? <b>Upcoming</b> : <b>Expired</b> ) }
                    </td>
                </tr> 
                <tr colSpan="2">
                    <td>
                    {!o.canceled && (new Date()) < o.startTime.toDate() ? <button  disabled={makingChanges} onClick={() => cancelMeet() } className='bookMe'>Cancel Meet</button> : ""}
                    </td>
                    <td colSpan={2}>Appoiment between?
                    <br/>- {o.MyEmail}
                    <br/>- {o.email}
                    <br/>
                    <br/>
                    <button  disabled={makingChanges} className='add2Google' onClick={() => myCalendar()}>Save to my Calendar</button>
                    </td>
                </tr>
                </>) : undefined}
            </tbody>
            </table>
{ !o ?           <div className='loader loaderLittle'>
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13.75 22c0 .966-.783 1.75-1.75 1.75s-1.75-.784-1.75-1.75.783-1.75 1.75-1.75 1.75.784 1.75 1.75zm-1.75-22c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 10.75c.689 0 1.249.561 1.249 1.25 0 .69-.56 1.25-1.249 1.25-.69 0-1.249-.559-1.249-1.25 0-.689.559-1.25 1.249-1.25zm-22 1.25c0 1.105.896 2 2 2s2-.895 2-2c0-1.104-.896-2-2-2s-2 .896-2 2zm19-8c.551 0 1 .449 1 1 0 .553-.449 1.002-1 1-.551 0-1-.447-1-.998 0-.553.449-1.002 1-1.002zm0 13.5c.828 0 1.5.672 1.5 1.5s-.672 1.501-1.502 1.5c-.826 0-1.498-.671-1.498-1.499 0-.829.672-1.501 1.5-1.501zm-14-14.5c1.104 0 2 .896 2 2s-.896 2-2.001 2c-1.103 0-1.999-.895-1.999-2s.896-2 2-2zm0 14c1.104 0 2 .896 2 2s-.896 2-2.001 2c-1.103 0-1.999-.895-1.999-2s.896-2 2-2z"/></svg>
                <p>Adding to Google Calendar...</p>
                </div>
            </div> : undefined}
         </div>

         <UseHistory></UseHistory>
        </>
    )

    function cancelMeet(){
        mChSet(true);
            try {
                updateDoc(doc(db, "calXevents", id), {
                    s24:false, s30:false, s5:false,
                    canceled:true, 
                }).then(() => {
                  navigate('/')
                  console.log("Document written!");
                });
              } catch (e) {
                console.error("Error adding document: ", e);
              }
    }

    function myCalendar(){
        mChSet(true);
        console.log("Add to Calendar")
        fetchCalendar(id).then(ref => {
            // save to localhost
            localStorage.setItem("MeetID", id)
            if(!ref || !ref.success){
                console.log("issue")
            }else{
                console.log(ref)
                window.location = ref.data;
            }
        }).catch(err => {
            console.log("issue", err)
        })
    }

}

export default ParamChild