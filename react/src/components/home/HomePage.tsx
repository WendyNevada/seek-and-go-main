import React from 'react'
import './HomePage.css'
import Navbar from '../navbar/Navbar'
import {assetForWeb} from '../../assets/assetStatic'
import AgencyRegister from '../register/agency-register/AgencyRegister'

const HomePage = () => {
  return (
    <div className="HomePage">
        <Navbar/>
        <AgencyRegister/>
        <div className='home-banner-container'>
            <div className="home-bannerImage-container">
                <img src={assetForWeb.HomePageBackground} alt="" />
            </div>
        </div>
    </div>
  )
}

export default HomePage
