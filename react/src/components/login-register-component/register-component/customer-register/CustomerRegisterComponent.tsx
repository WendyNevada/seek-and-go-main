import React, { useState } from 'react'

const CustomerRegisterComponent = () => {

    const [customerRegister, setCustomerRegister] = useState({
        customerName:'',
        email: '',
        dateOfBirth: '',
        sex:'',
        password: '',
        rePassword: ''
    })

  return (
    <div className="form-container sign-in">
        <form action="">
            <h1>As Customer</h1>
            <label htmlFor="">nama</label>
            <input type="text" placeholder="Name"/>
            <label htmlFor="">email</label>
            <input type="email" placeholder="Email" value={customerRegister.email}/>
            <label>tanggal lahir</label>
            <input type="date" placeholder="Tanggal Lahir" value={customerRegister.dateOfBirth}/>
            <label htmlFor="">kelamin</label>
            <input type="text" placeholder="Kelamin" value={customerRegister.sex}/>
            <label htmlFor="">password</label>
            <input type="text" placeholder="Password" value={customerRegister.password}/>
            <label htmlFor="">confirm password</label>
            <input type="text" placeholder="Confirm Password" value={customerRegister.rePassword}/>
            <button>Register</button>
        </form>
    </div>
  )
}

export default CustomerRegisterComponent
