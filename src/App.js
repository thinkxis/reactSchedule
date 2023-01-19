// import logo from './logo.svg';
import './App.css';
import {Link} from 'react-router-dom'

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDBOIr7SEF-X8Mjrp1bphbixB_nO4XLZvQ",
  authDomain: "test-dipesh.firebaseapp.com",
  projectId: "test-dipesh",
  storageBucket: "test-dipesh.appspot.com",
  messagingSenderId: "585852239023",
  appId: "1:585852239023:web:8d065aeed40c992402685a",
  measurementId: "G-3Z2PFE68NK"
};

const appX = initializeApp(firebaseConfig);
export const db = getFirestore(appX);

function App() {
  return (
    <div className="App">
      <div className='card'>
        <h2>Welcome to React Bookings</h2>
        <p>Share your availability with others. A scheduling automation platform for eliminating the back-and-forth emails to find the perfect time for a productive meeting.</p>
        <Link to="/listing">My Bookings</Link>
        <Link to="/book">Book Appoiment</Link>
      </div>
    </div>
  );
}


export default App;
