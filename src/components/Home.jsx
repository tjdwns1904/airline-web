import React from "react";
import Header from "./Header";
import Button from 'react-bootstrap/Button';
import Footer from "./Footer";

function Home(props) {
    return (
        <div>
            <Header login={props.isLoggedIn} isAdmin={props.isAdmin}/>
            <div className="background">
                <h1 className="home-content col-md-6">Check out the flights and make a reservation</h1>
                <Button variant="outline-info" className="home-btn" href="/flight">View Flights</Button>
            </div>
            <Footer/>
        </div>
    )
}

export default Home;