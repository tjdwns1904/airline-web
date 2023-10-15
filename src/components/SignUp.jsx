import React, { useState } from "react";
import Header from "./Header";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import MyDialog from "./MyDialog";


function SignUp() {
    const navigate = useNavigate();
    async function signUp() {
        if (user.password !== confirmPw) {
            setMatch(false);
            return;
        }
        if (user.password.length >= 8 && user.password.match(/[A-Z]/) && user.password.match(/[a-z]/)
            && user.password.match(/[0-9]/) && user.password.match(/[\W]/)) {
            setIsValid(true);
            setMatch(true);
            await fetch("http://localhost:8080/signUp", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
                .then(res => {
                    if (res.status === 201) {
                        setStatus(true);
                    }
                    handleOpen();
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            setIsValid(false);
        }
    }
    function handleChange(e) {
        var { name, value } = e.target;
        setUser(prev => {
            return ({
                ...prev,
                [name]: value
            })
        })
    }
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const move = () => {
        handleClose();
        setStatus(false);
        navigate("/login");
    }
    const [user, setUser] = useState({
        name: "",
        password: "",
        email: "",
        type: "normal"
    });
    const [status, setStatus] = useState(false);
    const [ open, setOpen ] = useState(false);
    const [isMatch, setMatch] = useState(true);
    const [isFilled, setIsFilled] = useState(true);
    const [isValid, setIsValid] = useState(true);
    const [confirmPw, setConfirmPw] = useState();
    return (
        <div>
            <Header />
            <MyDialog open={open} handleClose={status ? move : handleClose} 
            title={status ? "Registered Successfully!" : "Register Failed!"} 
            content={status ? "You have successfully registered! You can now log in with your account." : "Email already registered! Try another email."}/>
            <div className="background">
                <div className="signup-form pt-5">
                    <Form className="col-md-4 auth-form">
                        <p className="text">SIGN UP</p>
                        <hr />
                        <Form.Group className="mb-2 mx-auto" controlId="formBasicEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control name="email" type="email" placeholder="Email" onChange={e => handleChange(e)} />
                            <Form.Text className="text-muted">We will not share your email to anyone else.</Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-4 mx-auto" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control name="name" type="name" placeholder="Name" onChange={e => handleChange(e)} />
                        </Form.Group>
                        <Form.Group className="mb-4 mx-auto" controlId="formBasicPassword">
                            <Form.Label className="label">Password</Form.Label>
                            <Form.Control name="password" type="password" placeholder="Password" onChange={e => handleChange(e)} />
                            <Form.Text className="text-muted">* Must contain at least 1 capital, 1 special character, 1 digit <br/> (Longer than 8 characters.)</Form.Text>
                            <br />
                            <Form.Text className="text-danger" style={isValid ? { display: "none" } : { display: "inline" }}>
                                Please set a valid password!</Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-4 mx-auto" controlId="formBasicConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm Password" onChange={e => setConfirmPw((e.target.value))} />
                            <Form.Text className="text-danger" style={isMatch ? { display: "none" } : { display: "inline" }}>
                                Passwords provided don't match!</Form.Text>
                            <Form.Text className="text-danger" style={isFilled ? { display: "none" } : { display: "inline" }}>
                                Please fill in the form!</Form.Text>
                        </Form.Group>
                        <Button variant="outline-primary" className="btn mt-4 mx-auto" onClick={() => {
                            if (user.email && user.name && user.password && confirmPw) {
                                setIsFilled(true);
                                signUp();
                            } else {
                                setMatch(true);
                                setIsFilled(false);
                            }
                        }}>Create Account</Button>
                    </Form>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default SignUp;