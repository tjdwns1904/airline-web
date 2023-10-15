import Login from "./Login";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./Home";
import SignUp from "./SignUp";
import Flight from "./Flight";
import FlightDetail from "./FlightDetail";
import { useEffect, useState } from "react";
import Booking from "./Booking";
import Add from "./Add";
import Update from "./Update";


function App() {
  function setAuth(){
    if(localStorage.length > 0){
      setLoggedIn(true);
      if(localStorage.getItem('user_type') === 'admin'){
        setIsAdmin(true);
      }
    }
  };
  const [ isLoggedIn, setLoggedIn ] = useState(false);
  const [ isAdmin, setIsAdmin ] = useState(false);
  const [ bookedFlights, setBookedFlights ] = useState([]);
  useEffect(() => {
    setAuth();
  }, [isLoggedIn, isAdmin]);
  useEffect(() => {
    const url = "http://localhost:8080/book?id=" + localStorage.getItem('user');
    async function setFlights(){
      if(isLoggedIn){
        await fetch(url, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json' 
          }
        })
        .then(res => res.json())
        .then(res => {
          var ids = [];
          res.map(id => {
            ids.push(id);
          })
          setBookedFlights(ids);
        });
      }
    }
    setFlights();
  }, [isLoggedIn]);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} isAdmin={isAdmin}/>}/>
          <Route path="/login" element={<Login setAuth={setAuth}/>}/>
          <Route path="/signUp" element={<SignUp/>}/>
          <Route path="/flight" element={<Flight isLoggedIn={isLoggedIn} isAdmin={isAdmin}/>} />
          <Route path="/flightDetail" element={<FlightDetail isLoggedIn={isLoggedIn} isAdmin={isAdmin} bookedFlights={bookedFlights}/>}/>
          <Route path="/history" element={<Booking isLoggedIn={isLoggedIn} isAdmin={isAdmin}/>}/>
          <Route path="/add" element={<Add isLoggedIn={isLoggedIn} isAdmin={isAdmin}/>}/>
          <Route path="/update" element={<Update isLoggedIn={isLoggedIn} isAdmin={isAdmin}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
