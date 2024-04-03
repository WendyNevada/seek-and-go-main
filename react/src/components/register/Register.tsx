import React, { useState } from 'react'
// import './Register.css'
import { TextField } from '@mui/material';
import CustomerRegisterComponent from './customer-register/CustomerRegister';
import AgencyRegisterComponent from './agency-register/AgencyRegister';

const Register = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className='none'>
            <div id="container">
                {/* <AgencyRegisterComponent></AgencyRegisterComponent> */}
                <CustomerRegisterComponent></CustomerRegisterComponent>
                {/* <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of site features</p>
                            <button className="hidden" id="login" onClick={toggleForm}>are you a customer?</button>
                            <span></span>
                            <p>
                                Already have an account?
                                <a href="/Login">
                                    <div className="login-text"> Login</div>
                                </a>
                            </p>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Hello, Friend!</h1>
                            <p>Register with your personal details to use all of site features</p>
                            <button className="hidden" id="register" onClick={toggleForm}>are you an agency?</button>
                            <span></span>
                            <p>
                                Already have an account?
                                <a href="/Login">
                                    <div className="login-text"> Login</div>
                                </a>
                            </p>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default Register
