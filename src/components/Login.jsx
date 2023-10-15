import React, { useState } from "react";
import Header from "./Header";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

function Login(props) {
    const navigate = useNavigate();
    async function login(){
        await fetch("http://localhost:8080/users", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email: userEmail, password: password })
        })
        .then(res => res.json())
        .then(res => {
            if(res.length > 0){
                setIsMatch(true);
                var id = res[0].id;
                var type = res[0].type;
                localStorage.setItem('user', id);
                localStorage.setItem('user_type', type);
                props.setAuth();
                navigate("/");
            }else{
                setIsMatch(false);
            }
        })
    };
    const [ userEmail, setUserEmail ] = useState();
    const [ password, setPassword ] = useState();
    const [ isMatch, setIsMatch ] = useState(true);
    return (
        <div>
            <Header />
            <div className="background">
                <div className="login-form pt-5">
                    <Form className="col-md-4 auth-form">
                        <p className="text">USER LOGIN</p>
                        <hr/>
                        <Form.Group className="mb-2 mx-auto" controlId="formBasicEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" placeholder="Email" onChange={e => setUserEmail(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-4 mx-auto" controlId="formBasicPassword">
                            <Form.Label className="label">Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                            <Form.Text className="text-danger" style={isMatch ? { display: "none" } : { display: "inline" }}>
                                Incorrect Email and/or Password!</Form.Text>
                        </Form.Group>
                        <Button variant="outline-primary" className="btn mt-4 mx-auto" onClick={login}>Log in</Button>
                        <p className="text-muted">You don't have an account? <a href="/signUp" className="primary">Click Here!</a></p>
                    </Form>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Login;