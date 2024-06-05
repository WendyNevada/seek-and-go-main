import { useState } from 'react'
import { assetForWeb } from '../../assets/assetStatic'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import CommentRoundedIcon from '@mui/icons-material/CommentRounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded'
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import Login from '@mui/icons-material/Login';
import { useLogin } from '@/context/LoginContext'
import { useTranslation } from 'react-i18next'
import "flag-icons/css/flag-icons.min.css";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback } from '../ui/avatar'
import LanguageIcon from '@mui/icons-material/Language';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

    const { i18n } = useTranslation();
    const navigate = useNavigate();

    const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    };

    const { user } = useLogin();

    const { logout } = useLogin();
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
        {
            text:"Login",
            icon: <Login/>
        },
        {
            text:"Logout",
            icon:<LogoutIcon/>,
            onclick: () => {
                logout
            }
        }
    ]

    const navigateEditProfile = () => {
        navigate(`/Customer/EditProfileCustomer/${user?.account_id}`);
    }

    const navigateMyOrder = () => {
        navigate(`/Customer/MyOrder/${user?.customer_id}`);
    }

    return (
        <nav className='flex-no-wrap fixed top-0 flex w-full items-center justify-between bg-blue-800 lg:flex-wrap lg:py-4 p-6 z-50'>

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

            <div className='w-full hidden flex lg:flex lg:items-center lg:w-auto mr-6'>
                <a href='\' className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5'>Home</a>
                <a href='\AgencySearch' className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5'>Agency</a>
                {/* <a href='\About' className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5'>About</a>
                <a href='\Detail' className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5'>Details</a>
                <a href='' className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5'>Contact</a>
                <a href='' className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5'>
                    <BsCart2 className='navbar-cart-icon'/>
                </a> */}
                {
                    user ? (
                    <div>
                        <a onClick={navigateMyOrder} className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5 hover:cursor-pointer'>My Orders</a>
                    </div>) :
                    (
                        <div>
                            <a href='\Register' className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5'>Register</a>
                            <a href='\Login' className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 rounded-full hover:text-white mr-5 rounded-full border-2 border-neutral-50 px-6 pb-[6px] pt-1'>Login</a>
                        </div>
                    )
                }

                {/* <button onClick={() => logout()} className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5'>Logout</button> */}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="h-9 w-9 hover:cursor-pointer">
                        <AvatarFallback><LanguageIcon className='text-blue-600'/></AvatarFallback>
                        <span className="sr-only">Toggle language menu</span>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-24 mr-2">
                        <DropdownMenuItem>
                            <div className="flex items-center space-x-1" onClick={() => changeLanguage('en')}>
                                <span className="fi fi-us rounded-full"></span>
                                <span>English</span>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <div className="flex items-center space-x-1" onClick={() => changeLanguage('id')}>
                                <span className="fi fi-id rounded-full"></span>
                                <span>Indonesia</span>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                { user ?
                (<DropdownMenu>
                    <DropdownMenuTrigger className='text-teal-200 mx-5 hover:text-white'><PersonIcon/>{user?.account_name}</DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigateEditProfile()}><PersonIcon/>Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => logout()}><LogoutIcon/>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                ) : (<div></div>)}
            </div>


            {/* buka burger */}
            {/* <div className="navbar-menu-container">
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
            </Drawer> */}
        </nav>
      )
}

export default Navbar
