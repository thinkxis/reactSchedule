import React from 'react'
import {useNavigate} from 'react-router-dom'

function UseHistory() {
   const navigate = useNavigate()
   //useNavigate()
    return (
        <>
        <div className='manage'>
            <button onClick={() => navigate(-1)}>Go back</button>
            <button onClick={() => navigate('/')}>Back home</button>
        </div>
        </>
    )
}

export default UseHistory