import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import plane from '../0x0.jpg';
import MyModal from "./MyModal";
import MyDialog from "./MyDialog";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

function FlightDetail(props) {
    const { state } = useLocation();
    const navigation = useNavigate();
    const [flight, setFlight] = useState({
        flightNumber: "",
        dCity: "",
        aCity: "",
        dTime: "",
        aTime: "",
        price: 0
    });
    const url = "http://localhost:8080/flightDetail?id=" + state;
    async function getDetail() {
        await fetch(url, {
            method: "Get",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                const newFlight = {
                    flightNumber: res[0].flightNumber,
                    aCity: res[0].aCity,
                    dCity: res[0].dCity,
                    aTime: res[0].aTime,
                    dTime: res[0].dTime,
                    price: res[0].price
                }
                setFlight(newFlight);
            })
    };
    async function book() {
        if (props.isLoggedIn) {
            var userId = localStorage.getItem('user');
            var flightId = state;
            await fetch("http://localhost:8080/book", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ user_id: userId, flight_id: flightId })
            })
                .then(res => {
                    if (res.status === 201) {
                        handleOpen();
                        setIsBooked(true);
                    }
                });
        } else {
            navigation('/login');
        }
    }
    const url1 = "http://localhost:8080/delete/" + state;
    const deleteFlight = async () => {
        await fetch(url1, {
            method: "Delete"
        })
            .then(res => {
                if (res.status === 201) {
                    handleOpen();
                };
            });
    };
    const url2 = "http://localhost:8080/cancel/" + state + "/" + localStorage.getItem('user');
    const cancelBooking = async () => {
        await fetch(url2, {
            method: "DELETE"
        })
            .then(res => {
                if (res.status === 201) {
                    handleOpen();
                    setIsBooked(false);
                };
            });
    };
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const closeDialog = () => setOpen(false);
    const move = () => {
        closeDialog();
        navigation('/flight');
    }
    const [isBooked, setIsBooked] = useState(false);
    const [cardNoIsValid, setCardNoIsValid] = useState(true);
    const [expIsValid, setExpIsValid] = useState(true);
    const [cvcIsValid, setCvcIsValid] = useState(true);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [bookingOpen, setBookingOpen] = useState(false);
    const handleBookingOpen = () => setBookingOpen(true);
    const handleBookingClose = (event, reason) => {
        if (reason && reason == "backdropClick") return;
        setBookingOpen(false);
    }
    const [paymentDetail, setPaymentDetail] = useState({
        cardNo: "",
        exp: "",
        cvc: ""
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentDetail(prev => {
            return (
                {
                    ...prev,
                    [name]: value
                }
            );
        });
    };
    const checkValidity = () => {
        const regexCardNo = /(\d{4})-(\d{4})-(\d{4})-(\d{4})/;
        const regexExp = /\d{2}\/\d{2}/;
        const regexCvc = /^\d{3}$/;
        if (!regexCardNo.test(paymentDetail.cardNo)) {
            setCardNoIsValid(false);
        } else {
            setCardNoIsValid(true);
        }
        if (!regexExp.test(paymentDetail.exp)) {
            setExpIsValid(false);
        } else {
            setExpIsValid(true);
        }
        if (!regexCvc.test(paymentDetail.cvc)) {
            setCvcIsValid(false);
        } else {
            setCvcIsValid(true);
        }
        if (regexCardNo.test(paymentDetail.cardNo) && regexExp.test(paymentDetail.exp) && regexCvc.test(paymentDetail.cvc)) {
            return true;
        } else {
            return false;
        }
    }
    useEffect(() => {
        getDetail();
        props.bookedFlights.map(id => {
            if (state === id.flight_id) {
                setIsBooked(true);
            }
        });
    }, []);
    return (
        <div>
            <Header login={props.isLoggedIn} isAdmin={props.isAdmin} />
            <MyDialog open={open} handleClose={props.isAdmin ? move : closeDialog}
                title={props.isAdmin ? "Deletion Completed" : !isBooked ? "Cancellation Completed" : "Booking Completed"}
                content={props.isAdmin ? "The flight has been successfully removed." :
                    !isBooked ? "The flight has been succesfully cancelled." : "The flight has been successfully booked!"} />
            <MyModal handleClose={handleClose} show={show} handleData={props.isAdmin ? deleteFlight : cancelBooking}
                title={props.isAdmin ? "Delete Flight Information" : "Cancel Flight"}
                content={props.isAdmin ? "Do you really want to delete the flight information?" : "Do you really want to cancel this flight?"}
                btnContent={props.isAdmin ? "Delete Flight" : "Cancel Flight"} />
            <Dialog className="myDialog" open={bookingOpen} onClose={handleBookingClose}>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please fill in the form to complete reservation.</DialogContentText>
                    <TextField className="booking-detail" id="standard-read-only-input" InputProps={{ readOnly: true }}
                        label="Flight No." value={flight.flightNumber} variant="standard" />
                    <TextField className="booking-detail" id="standard-read-only-input" InputProps={{ readOnly: true }}
                        label="From - To" value={flight.dCity + " - " + flight.aCity} variant="standard" />
                    <TextField className="booking-detail" id="standard-read-only-input" InputProps={{ readOnly: true }}
                        label="Time" value={flight.dTime.slice(9, 14) + " - " + flight.aTime.slice(9, 14)} variant="standard" />
                    <TextField error={!cardNoIsValid} helperText={cardNoIsValid ? "" : "Invalid"} className="booking-detail" name="cardNo" onChange={(e) => handleChange(e)} label="Card No." placeholder="ex) 0000-0000-0000-0000" fullWidth variant="outlined" margin="dense" />
                    <TextField error={!expIsValid} helperText={expIsValid ? "" : "Invalid"} className="booking-detail" name="exp" onChange={(e) => handleChange(e)} label="Expires" placeholder="ex) 10/26" variant="outlined" margin="dense" />
                    <TextField error={!cvcIsValid} helperText={cvcIsValid ? "" : "Invalid"} className="booking-detail" name="cvc" onChange={(e) => handleChange(e)} label="CVC" placeholder="ex) 000" variant="outlined" margin="dense" />
                    <TextField id="standard-read-only-input" InputProps={{ readOnly: true }} value={flight.price.toLocaleString("en-US") + " VND"} className="booking-detail" label="Price" variant="standard" fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button variant="secondary" onClick={handleBookingClose}>Cancel</Button>
                    <Button onClick={() => {
                        if (checkValidity()) {
                            handleBookingClose();
                            book();
                        }
                    }}>Book</Button>
                </DialogActions>
            </Dialog>
            <div className="background">
                <Card className="desc-table col-md-6">
                    <p className="table-title">{flight.flightNumber}</p>
                    <div className="table-items">
                        <ul className="flight-detail inner">
                            <li>{flight.dTime.slice(9, 14)}</li>
                            <li className="text-muted">{flight.dTime.slice(0, 8)}</li>
                            <li className="aTime">{flight.aTime.slice(9, 14)}</li>
                            <li className="text-muted">{flight.aTime.slice(0, 8)}</li>
                        </ul>
                        <div className="lineContainer">
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                        <ul className="flight-detail inner">
                            <li className="dCity">{flight.dCity}</li>
                            <li>
                                <Card className="flight-detail-card">
                                    <p>{flight.flightNumber}</p>
                                    <p>{flight.price.toLocaleString("en-US")} VND</p>
                                </Card>
                            </li>
                            <li className="aCity">{flight.aCity}</li>
                        </ul>
                    </div>
                    <Button className={isBooked ? "btn-danger btn-detail" : "btn-detail"}
                        onClick={() => {
                            if (!props.isAdmin) {
                                if (!isBooked) {
                                    handleBookingOpen();
                                }
                                else {
                                    handleShow();
                                };
                            } else {
                                navigation('/update', { state: state });
                            }
                        }}>{props.isAdmin ? "Update Flight" : isBooked ? "Cancel Flight" : "Book a Flight"}</Button>
                    {props.isAdmin && <Button onClick={handleShow} className="btn-danger btn-delete">Delete</Button>}
                </Card>
            </div>
            <Footer />
        </div>
    )
}

export default FlightDetail;