import React, { useState } from 'react'
// import './Navbar.css'
// import { BsCart2 } from 'react-icons/bs'
import { assetForWeb } from '../../assets/assetStatic'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
// import CommentRoundedIcon from '@mui/icons-material/CommentRounded'
// import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
// import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded'
// import { HiOutlineBars3 } from 'react-icons/hi2'
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
// import Login from '@mui/icons-material/Login';
import { Link } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout';
import { useLogin } from '@/context/LoginContext'
import { urlConstant } from '@/urlConstant'

const Navbar = () => {
    const { logout } = useLogin();
    const [openMenu, setOpenMenu] = useState(false)
    const menuOptions = [
        {
            text:"Product",
            icon:<HomeIcon/>,
            link: urlConstant.AgencyHomePage
        },
        {
            text:"About",
            icon:<InfoIcon/>,
            link:"/Agency/Product"
        },
        {
            text:"Logout",
            icon:<LogoutIcon/>,
            onclick: () => {
                logout
            }
        },
        // {
        //     text:"Contact",
        //     icon:<PhoneRoundedIcon/>
        // },
        // {
        //     text:"Cart",
        //     icon:<ShoppingCartRoundedIcon/>
        // },
        // {
        //     text:"Login",
        //     icon: <Login/>
        // }
    ]

    return (
        <nav className='flex-no-wrap fixed top-0 flex w-full items-center justify-between bg-blue-800 lg:flex-wrap lg:py-4 p-6 z-10'>

            <div className='fill-current h-14 w-14 mr-4 width=70 flex flex-row text-teal-200 '>
                <img src={assetForWeb.logo}/>
            </div>

            <div className="block lg:hidden ml-4">
                <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white" onClick={() => setOpenMenu(true)}>
                <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
                </button>
                <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor='right'>
                    <Box sx={{ width: 220, backgroundColor: 'transparent'}}
                    role='presentation'
                    onClick={() => setOpenMenu(false)}
                    onKeyDown={() => setOpenMenu(false)}>
                    <List>
                            {menuOptions.map((item) => (
                                <ListItemButton component="a" href={item.link} target="_blank">
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text}></ListItemText>
                                </ListItemButton>
                            ))}
                        </List>
                    </Box>
                </Drawer>
            </div>

            <div className='w-full hidden flex lg:flex lg:items-center lg:w-auto'>
                <Link to ={urlConstant.AgencyHomePage} className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5'>Dashboard</Link>
                <Link to="/Agency/Product" className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5'>Product</Link>
                <button onClick={() => logout()} className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5'>Logout</button>
            </div>
        </nav>
      )
}

export default Navbar
