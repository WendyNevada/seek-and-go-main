import React from 'react'
// import './HomePage.css'
// import Navbar from '../navbar/Navbar'
import {assetForWeb} from '../../assets/assetStatic'
import { TypewriterEffect } from '../ui/AceTernity/typewriter-effect';

const Home = () => {
    const words = [
        {
          text: "Welcome",
        },
        {
          text: "To",
        },
        {
          text: "Seek",
        },
        {
          text: "&",
        },
        {
          text: "Go.",
          className: "text-blue-500 dark:text-blue-500",
        },
      ];

  return (
    <div className="mt-30 flex flex-col items-center justify-center h-[40rem]">
        <div className="bg-cover bg-center mt-20 absolute inset-0 place-content-center" style={{ backgroundImage: `url(${assetForWeb.HomePageBackground})`, height: '750px' }}>

            <TypewriterEffect words={words}/>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50"></div>
        </div>

        {/* <div className='"bg-cover bg-center absolute inset-0 mt-20 bg-gradient-to-r from-cyan-500 to-blue-500'></div> */}
    </div>
  )
}

export default Home
