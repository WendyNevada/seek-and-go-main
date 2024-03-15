import React from 'react'
import './Navbar.css'
import { BsCart2 } from 'react-icons/bs'
import { assetForWeb } from '../../assets/assetStatic'

const Navbar = () => {
    return (
        <nav className='navbar'>
            <div className='nav-logo-container'>
                <img src={assetForWeb.logo}/>
            </div>
            <div className='navbar-links-container'>
                    <a href='\'>Home</a>
                    <a href='\About'>About</a>
                    <a href='\Detail'>Details</a>
                    <a href=''>Contact</a>
                    <a href=''>
                        <BsCart2 className='navbar-cart-icon'/>
                    </a>
                    <button className='primary-button'>Bookings Now</button>
                </div>
        </nav>
      )
}

export default Navbar
