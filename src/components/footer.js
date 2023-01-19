import React from 'react'
// import {Link} from 'react-router-dom'
import logo from './../logo.svg';

export default function Footer() {
    return (
        <>
        <footer>
            <img src={logo} alt="logo" />
            <p>Made by<a href='https://google.com'>Dipesh Bhoir</a>
            <br/>© All Rights Reserved</p>
        </footer>
        </>
    )
}