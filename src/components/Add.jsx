import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MyDialog from "./MyDialog";

function Add(props) {
    const navigate = useNavigate();
    const [flight, setFlight] = useState({
        flightNumber: "",
        dCity: "",
        aCity: "",
        dTime: "",
        aTime: "",
        price: 0
    });
    const [isFilled, setIsFilled] = useState(true);
    const [isValid, setIsValid] = useState(true);
    const [ isGood, setIsGood ] = useState(false);
    const [ open, setOpen ] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const move = () => {
        handleClose();
        navigate("/flight");
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFlight((prev) => {
            return (
                {
                    ...prev,
                    [name]: value
                }
            )
        })
    }

    const inputValidation = () => {
        const regexFlightNumber = /([A-Z]{2})+([0-9]{3})/;
        const regexTime = /([0-9]{2})+\W+([0-9]{2})+\W+([0-9]{2})+\s+([0-9]{2})+:+([0-9]{2})/;
        if (regexFlightNumber.test(flight.flightNumber) && flight.flightNumber.length < 7
            && regexTime.test(flight.dTime) && flight.dTime.length < 15 &&
            regexTime.test(flight.aTime) && flight.aTime.length < 15) {
            setIsValid(true);
            return true;
        };
        setIsValid(false);
        return false;
    }

    const addFlight = async () => {
        await fetch("http://localhost:8080/add", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flight)
        })
        .then(res => {
            if(res.status === 201){
               setIsGood(true); 
            }
            handleOpen();
        });
        setIsFilled(true);
    }
    return (
        <div>
            <Header isAdmin={props.isAdmin} login={props.isLoggedIn} />
            <MyDialog open={open} handleClose={isGood ? move : handleClose}
            title={isGood ? "Successfully Added!" : "Failed to add"}
            content={isGood ? "The flight has successfully added to the list." : "The flight already exists!"}/>
            <div className="background">
                <Form className="add-form col-md-4">
                    <Form.Group className="mb-2">
                        <Form.Label>Flight Number</Form.Label>
                        <Form.Control placeholder="ex) VJ123" name="flightNumber" onChange={(e) => handleChange(e)} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Departure City</Form.Label>
                        <Form.Control placeholder="ex) Hanoi" name="dCity" onChange={(e) => handleChange(e)} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Arrival City</Form.Label>
                        <Form.Control placeholder="ex) Busan" name="aCity" onChange={(e) => handleChange(e)} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Departure Time</Form.Label>
                        <Form.Control placeholder="ex) 23/08/31 07:00" name="dTime" onChange={(e) => handleChange(e)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Arrival Time</Form.Label>
                        <Form.Control placeholder="ex) 23/08/31 07:00" name="aTime" onChange={(e) => handleChange(e)} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Price</Form.Label>
                        <Form.Control placeholder="ex) 2000000" name="price" onChange={(e) => handleChange(e)} />
                        <Form.Text className="text-danger" style={isFilled ? { display: "none" } : { display: "inline" }}>
                            Please fill in the form!</Form.Text>
                        <Form.Text className="text-danger" style={isValid ? { display: "none" } : { display: "inline" }}>
                            Please fill the form in a right format!</Form.Text>
                    </Form.Group>
                    <Button className="btn mt-4 ms-auto" onClick={() => {
                        if (flight.flightNumber && flight.dCity && flight.aCity && flight.dTime && flight.aTime && flight.price > 0) {
                            if (inputValidation()) {
                                addFlight();
                            }
                        } else {
                            setIsFilled(false);
                        }
                    }}>Add Flight</Button>
                </Form>
            </div>
            <Footer />
        </div>
    )
}

export default Add;