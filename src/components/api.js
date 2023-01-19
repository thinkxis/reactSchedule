import { doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../App';


const fetchCalendar = async (id, code) => {
const res = await fetch(`http://localhost:5001/test-dipesh/us-central1/server_task/api/setMeet/IN/${id}?code=${ encodeURIComponent(code) }`);
//   const res = await fetch(`https://test-dipesh.web.app/api/setMeet/IN/${id}?code=${ encodeURIComponent(code) }`);
  return res.json();
}

function ApiHandle() {
    const navigate = useNavigate()

    const [onChains, setOnChains] = useState(null);

    const { code } = useParams();
    const { count } = useParams();


    useEffect(() => {

        setOnChains("OK")
        if (onChains !== null) {
            if(count === "brave1" && localStorage.getItem("MeetID") && code){
                console.log("localstorage", code, localStorage.getItem("MeetID"))// triggered 1 time!
                const id = localStorage.getItem("MeetID");
                fetchCalendar(id, code).then(v => {
                    console.log(v)

                    if(!v || !v.success){
                        console.log("issue somewhere...")
                    }else{
                        let r = v.data;

            try {
                updateDoc(doc(db, "calXevents", id), {
                  meet:r.data.hangoutLink
                }).then(() => {
                    
                        localStorage.removeItem("MeetID")
                        console.log(r.data)
                        alert("The task has been added to Google Calendar")
                        window.location = r.data.htmlLink;

                });
              } catch (e) {
                console.error("Error adding document: ", e);
              }

                    }
                }).catch(err => {
                    console.log(err)
                    navigate('/')
                })
            }else{
                navigate('/')
            }
        }
        }, [onChains]);


    return (
        <>
        <div className='loader'>
            <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13.75 22c0 .966-.783 1.75-1.75 1.75s-1.75-.784-1.75-1.75.783-1.75 1.75-1.75 1.75.784 1.75 1.75zm-1.75-22c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 10.75c.689 0 1.249.561 1.249 1.25 0 .69-.56 1.25-1.249 1.25-.69 0-1.249-.559-1.249-1.25 0-.689.559-1.25 1.249-1.25zm-22 1.25c0 1.105.896 2 2 2s2-.895 2-2c0-1.104-.896-2-2-2s-2 .896-2 2zm19-8c.551 0 1 .449 1 1 0 .553-.449 1.002-1 1-.551 0-1-.447-1-.998 0-.553.449-1.002 1-1.002zm0 13.5c.828 0 1.5.672 1.5 1.5s-.672 1.501-1.502 1.5c-.826 0-1.498-.671-1.498-1.499 0-.829.672-1.501 1.5-1.501zm-14-14.5c1.104 0 2 .896 2 2s-.896 2-2.001 2c-1.103 0-1.999-.895-1.999-2s.896-2 2-2zm0 14c1.104 0 2 .896 2 2s-.896 2-2.001 2c-1.103 0-1.999-.895-1.999-2s.896-2 2-2z"/></svg>
            <p>Adding to Google Calendar...</p>
            </div>
        </div>
        </>
    )

}

export default ApiHandle