import React from 'react'
// import './HomePage.css'
import Navbar from '../navbar/Navbar'
import {assetForWeb} from '../../assets/assetStatic'

const HomePage = () => {
  return (
    <div className="">
        <Navbar/>
        <div className='home-banner-container'>
            {/* <div className="home-bannerImage-container">
                <img src={assetForWeb.HomePageBackground} alt="" />
            </div> */}
        </div>
    </div>
  )
}

export default HomePage
