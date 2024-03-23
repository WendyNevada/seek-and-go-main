import React, { useState } from 'react'
import './Navbar.css'
import { BsCart2 } from 'react-icons/bs'
import { assetForWeb } from '../../assets/assetStatic'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import CommentRoundedIcon from '@mui/icons-material/CommentRounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded'
import { HiOutlineBars3 } from 'react-icons/hi2'
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'

const Navbar = () => {
    const [openMenu, setOpenMenu] = useState(false)
    const menuOptions = [
        {
            text:"Home",
            icon:<HomeIcon/>,
            link:"/"
        },
        {
            text:"About",
            icon:<InfoIcon/>,
            link:"/About"
        },
        {
            text:"Testimonials",
            icon:<CommentRoundedIcon/>,
            link:"/Detail"
        },
        {
            text:"Contact",
            icon:<PhoneRoundedIcon/>
        },
        {
            text:"Cart",
            icon:<ShoppingCartRoundedIcon/>
        },
    ]

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

            {/* buka burger */}
            <div className="navbar-menu-container">
                <HiOutlineBars3 onClick={() => setOpenMenu(true)}></HiOutlineBars3>
            </div>
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
        </nav>
      )
}

export default Navbar
