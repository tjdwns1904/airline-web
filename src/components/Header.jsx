import React, { useState } from "react";
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import MyModal from "./MyModal";
import { useNavigate } from "react-router-dom";

function Header(props) {
    function logOut(){
        localStorage.clear();
        navigate("/");
        navigate(0);
    }
    const navigate = useNavigate();
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [ show, setShow ] = useState(false);
    const isLoggedIn = props.login;
    const isAdmin = props.isAdmin;
    if (!isLoggedIn) {
        return (
            <Navbar bg="dark" expand="lg" variant="dark">
                <Container>
                    <Navbar.Brand className="title">Airline</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/flight">Flight</Nav.Link>
                        <Nav.Link href="/login" className="register">Log In / Sign Up</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        )
    } else {
        return (
            <Navbar bg="dark" expand="lg" variant="dark">
                <MyModal show={show} handleClose={handleClose} handleData={logOut}
                title="Log Out" content="Do you really want to log out?" btnContent="Log Out"/>
                <Container>
                    <Navbar.Brand className="title">Airline</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/flight">Flight</Nav.Link>
                        {isAdmin ? <Nav.Link href="/add">Add Flight</Nav.Link> : <Nav.Link href="/history">History</Nav.Link>}
                        <Nav.Link className="register" onClick={handleShow}>Log Out</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        )
    }
}

export default Header;