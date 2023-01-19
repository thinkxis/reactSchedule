import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from './components/header'
import Footer from './components/footer'
// import UseHistory from './components/useHistory'
import Listing from "./components/listing";
import Book from "./components/book";
import ParamChild from "./components/paramChild";
import ApiHandle from "./components/api";

const Routing = () => {
  return(
    <Router>
      <Header/>
    <div className='container'>
      <Routes>
        <Route path="/" exact element={<App/>} />
        <Route path="/listing" element={<Listing/>} />
        <Route path="/book" element={<Book/>} />
        <Route path="/modify/:id" element={<ParamChild/>} />
        <Route path="/api-sign/:count/:code" element={<ApiHandle/>} />
      </Routes>
    </div>
      <Footer/>
    </Router>
  )
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
