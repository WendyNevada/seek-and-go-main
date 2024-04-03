import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    <div className="min-h-screen w-full bg-gray-100 p-0 sm:p-12">
        <div className="mx-auto max-w-md px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
            <form action="">
                <h1 className="text-2xl font-bold mb-8">Form With Floating Labels</h1>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" placeholder="Email" />
                </div>
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
    </div>
  )
}

export default CustomerRegisterComponent
