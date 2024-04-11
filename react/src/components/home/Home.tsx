import React from 'react'
// import './HomePage.css'
// import Navbar from '../navbar/Navbar'
import {assetForWeb} from '../../assets/assetStatic'

const Home = () => {
  return (
    <div className="mt-30 ">
        <div className="bg-cover bg-center mt-20 absolute inset-0" style={{ backgroundImage: `url(${assetForWeb.HomePageBackground})`, height: '750px' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
    </div>
  )
}

export default Home
