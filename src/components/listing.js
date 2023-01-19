import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import {db} from './../App'
import { collection, getDocs, orderBy, where } from "firebase/firestore";
   


export default function Listing() {


    const [myS, mySet] = useState([]);
    const fetchPosts = async () => {
        let D24 = addMin((new Date), 1440);
        await getDocs(collection(db, "calXevents"), where( "startTime", ">=",  D24 ), orderBy("startTime", "desc"))
            .then((querySnapshot)=>{               
                const newData = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
                mySet(newData)
                return newData;
        })
    }

    useEffect(()=>{
        fetchPosts()
    }, [])



    return (
        <>
        <div className='Listing'>
            <table>
                <thead>
                <tr>
                    <th>Schudule</th>
                    <th className='line' colSpan={2}>About meetings</th>
                </tr>
                </thead>
            <tbody>
                {myS.length > 0 ? <>{
                myS.map((o) =>  <tr key={o.id}>
                    <td> {
                    new Date(o.startTime.toDate()).getDate()
                    }-{
                    new Date(o.startTime.toDate()).getMonth()
                    }-{
                    new Date(o.startTime.toDate()).getFullYear()
                    }<br/>{
                        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(o.startTime.toDate()).getDay()]
                        } { new Date(o.startTime.toDate()).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) }</td>
                    <td>{o?.MyName}
                    <br/><Link to={"/modify/" + o.id}>Manage Status?</Link></td>
                    <td>{o.meet ? <a target="_blank" rel="noreferrer" href={o.meet}>Google Meet Link</a> : "..."}
                    <br/>
                        { o.canceled ? <b>Terminated</b> : ( (new Date()) < o.startTime.toDate() ? <b>Upcoming</b> : <b>Expired</b> ) }
                    </td>
                </tr>
                )}</> : <tr><td>'Nothing to Show...'</td></tr>}
            </tbody>
            </table>
        </div>
        </>
    )

    function addMin(d, m) {
        var result = new Date(d);
        result.setMinutes(result.getMinutes() + m);
        return result;
    }
}
