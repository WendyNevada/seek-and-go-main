import { useState } from 'react'
import { assetForWeb } from '../../assets/assetStatic'
import HomeIcon from '@mui/icons-material/Home'
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useLogin } from '@/context/LoginContext'
import { useTranslation } from 'react-i18next'
import "flag-icons/css/flag-icons.min.css";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback } from '../ui/avatar'
import LanguageIcon from '@mui/icons-material/Language';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { urlConstant } from '@/urlConstant'
import LoginIcon from '@mui/icons-material/Login';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

const Navbar = () => {

    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

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
        }
    ]

    const menuSideBar = [
        {
            text:"Home",
            icon:<HomeIcon/>,
            link:"/"
        },
        {
            text:"My Order",
            icon:<LocalGroceryStoreIcon/>,
            link:`/Customer/MyOrder/${user?.customer_id}`
        },
        {
            text:"Profile",
            icon:<PersonIcon/>,
            link:`/Customer/EditProfileCustomer/${user?.customer_id}`
        },
        {
            text:"Login",
            icon:<LoginIcon/>,
            link:"/Login"
        },
        {
            text:"Logout",
            icon:<LogoutIcon/>,
            action:logout
        }
    ]

    const menuSideBarAgency = [
        {
            text:"Home",
            icon:<HomeIcon/>,
            link:"/"
        },
        {
            text:"My Order",
            icon:<LocalGroceryStoreIcon/>,
            link:`/Customer/MyOrder/${user?.customer_id}`
        },
        {
            text:"Profile",
            icon:<PersonIcon/>,
            link:`/Customer/EditProfileCustomer/${user?.customer_id}`
        },
        {
            text:"Register",
            icon:<AppRegistrationIcon/>,
            link:`/Register`
        },
        {
            text:"Login",
            icon:<LoginIcon/>,
            link:"/Login"
        },
        {
            text:"Logout",
            icon:<LogoutIcon/>,
            action:logout
        },
        {
            text:"Agency Dashboard",
            icon:<PersonIcon/>,
            link:"/Agency/"
        },
    ]

    const navigateEditProfile = () => {
        navigate(`/Customer/EditProfileCustomer/${user?.account_id}`);
    }

    const navigateMyOrder = () => {
        navigate(`/Customer/MyOrder/${user?.customer_id}`);
    }

    const isActiveLink = (path: string) => {
        if (location.pathname === path) {
            return true;
        }
        // Handle wildcard path for paths ending with a number
        const regex = new RegExp('/[^/]+/[^/]+/\\d+$');
        if (regex.test(location.pathname)) {
            const basePath = location.pathname.replace(/\d+$/, '');
            return path.startsWith(basePath);
        }
        return false;
    };

    const handleNavigation = (link:string) => {
        navigate(link);
        setOpenMenu(false);
      };

      const handleAction = (action: () => void) => {
        action();
        setOpenMenu(false);
    };

    return (
        <nav className='flex-no-wrap fixed top-0 flex w-full items-center justify-between bg-blue-800 lg:flex-wrap lg:py-4 p-6 z-50'>

            <div className='fill-current h-14 w-14 mr-4 width=70 flex flex-row text-teal-200 '>
                <img className='cursor-pointer' src={assetForWeb.logo} onClick={() => navigate(urlConstant.HomePage)}/>
            </div>

            <div className="block lg:hidden ml-4">
                <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white" onClick={() => setOpenMenu(true)}>
                <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
                </button>

                {user?.role === "Customer" ? (
                    <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor='right'>
                        <Box sx={{ width: 220, backgroundColor: 'transparent'}}
                        role='presentation'
                        onClick={() => setOpenMenu(false)}
                        onKeyDown={() => setOpenMenu(false)}>
                            <List>
                                {menuSideBar.map((item) => (
                                    <ListItemButton component="a" onClick={() => item.link ? handleNavigation(item.link) : (item.action ? handleAction(item.action) : undefined)} target="_blank">
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.text}></ListItemText>
                                    </ListItemButton>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                ) : (
                    <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor='right'>
                        <Box sx={{ width: 220, backgroundColor: 'transparent'}}
                        role='presentation'
                        onClick={() => setOpenMenu(false)}
                        onKeyDown={() => setOpenMenu(false)}>
                            <List>
                                {menuSideBarAgency.map((item) => (
                                    <ListItemButton component="a" onClick={() => item.link ? handleNavigation(item.link) : (item.action ? handleAction(item.action) : undefined)} target="_blank">
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.text}></ListItemText>
                                    </ListItemButton>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                )}
            </div>

            <div className='w-full hidden lg:flex lg:items-center lg:w-auto mr-6'>
            {menuOptions.map((item, index) => (
            <a key={index} href={item.link}
                className={`block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5
                ${
                    (
                        (location.pathname === item.link) ||
                        (isActiveLink('/Customer/PackageDetail/')) ||
                        (isActiveLink('/Customer/PackageOrderDetail/')) ||
                        (isActiveLink('/Customer/VehicleDetail/')) ||
                        (isActiveLink('/Customer/VehicleOrderDetail/')) ||
                        (isActiveLink('/Customer/HotelDetail/')) ||
                        (isActiveLink('/Customer/HotelOrderDetail/')) ||
                        (isActiveLink('/Customer/AttractionDetail/')) ||
                        (isActiveLink('/Customer/AttractionOrderDetail/'))
                    )
                    ? 'text-white border-b-2 border-white'
                    :
                    ''
                }`}>
                {item.text}
            </a>
            ))}

            <a href='\AgencySearch' className={`block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5
                ${
                    (
                        (location.pathname === `/AgencySearch`) ||
                        (isActiveLink('/AgencySearch/AgencyDetail/')) ||
                        (isActiveLink('/Customer/RequestCustomPackage/'))
                    )
                    ?
                    'text-white border-b-2 border-white'
                    :
                    ''
                }
            `}>Agency</a>

            {user?.role === 'Agency' && (
                <Link
                    to ={urlConstant.AgencyHomePage}
                    className={`block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5
                        ${
                            (location.pathname === urlConstant.AgencyHomePage) ||
                            (isActiveLink('/Agency/Approval/'))
                            ?
                            'text-white border-b-2 border-white'
                            :
                            ''
                        }
                    `}>Dashboard
                </Link>
            )}

            {user ? (
            <div>
                <a onClick={navigateMyOrder}
                    className={`block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5 hover:cursor-pointer
                        ${
                            (
                                (location.pathname === `/Customer/MyOrder/${user?.customer_id}`) ||
                                (isActiveLink('/Customer/MyOrderDetail/')) ||
                                (location.pathname === `/Customer/CustomPackage`) ||
                                (isActiveLink('/Customer/CustomPackageDetail/'))
                            )
                            ?
                            'text-white border-b-2 border-white'
                            :
                            ''
                        }
                    `}>My Orders</a>
            </div>) : (
            <div>
                <a href='\Register'
                    className={`block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5
                    ${
                        ((location.pathname === `/Register`))
                        ?
                        'text-white border-b-2 border-white'
                        :
                        ''
                    }
                    `}
                    >Register</a>
                <a href='\Login'
                    className={`block mt-4 lg:inline-block lg:mt-0 text-teal-200 rounded-full hover:text-white mr-5 border-2 border-neutral-50 px-6 pb-[6px] pt-1
                    ${
                        ((location.pathname === `/Login`))
                        ?
                        'text-white border-b-2 border-white'
                        :
                        ''
                    }
                    `}
                >Login</a>
            </div>
            )}

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
                    <DropdownMenuTrigger
                        className='text-teal-200 mx-5 hover:text-white'>
                            <div className={`
                                ${
                                    ((location.pathname === `/Customer/EditProfileCustomer/${user?.account_id}`))
                                    ?
                                    'text-white border-b-2 border-white'
                                    :
                                    ''
                                }
                            `}>
                                <PersonIcon/>{user?.account_name}
                            </div>
                    </DropdownMenuTrigger>
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
