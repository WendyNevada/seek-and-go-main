import { useState } from 'react'
import { assetForWeb } from '../../assets/assetStatic'
import HomeIcon from '@mui/icons-material/Home'
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout';
import { useLogin } from '@/context/LoginContext'
import { urlConstant } from '@/urlConstant'
import { useTranslation } from 'react-i18next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback } from '../ui/avatar'

// icon
import LanguageIcon from '@mui/icons-material/Language';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const Navbar = () => {

    const { i18n } = useTranslation();
    const location = useLocation();

    const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    };

    const { user } = useLogin();
    const { logout } = useLogin();
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false)
    const menuOptions = [
        {
            text:"Dashboard",
            icon:<HomeIcon/>,
            link: urlConstant.AgencyHomePage
        },
        {
            text:"Product",
            icon:<CategoryIcon/>,
            link:"/Agency/Product"
        },
        {
            text:"Custom Package",
            icon:<AutoAwesomeIcon/>,
            link:"/Agency/CustomPackage"
        },
        {
            text:"Logout",
            icon:<LogoutIcon/>,
            action:logout
        }
    ]

    const navigateEditProfile = () => {
        navigate(`/Agency/EditProfileAgency/${user?.account_id}`);
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

      const handleAction = (action: () => void | undefined) => {
        action();
        setOpenMenu(false);
    };

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
                                <ListItemButton component="a" onClick={() => item.link ? handleNavigation(item.link) : (item.action ? handleAction(item.action) : undefined)} target="_blank">
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text}></ListItemText>
                                </ListItemButton>
                            ))}
                        </List>
                    </Box>
                </Drawer>
            </div>

            <div className='w-full hidden lg:flex lg:items-center lg:w-auto'>
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

                <Link
                    to="/Agency/Product"
                    className={`block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5
                        ${
                            (location.pathname === "/Agency/Product") ||
                            (location.pathname === "/Agency/AddAttraction") ||
                            (location.pathname === "/Agency/AddHotel") ||
                            (location.pathname === "/Agency/AddVehicle") ||
                            (location.pathname === "/Agency/AddPackage") ||
                            (isActiveLink("/Agency/EditPackage/")) ||
                            (isActiveLink("/Agency/EditAttraction/")) ||
                            (isActiveLink("/Agency/EditHotel/")) ||
                            (isActiveLink("/Agency/EditVehicle/"))
                            ?
                            'text-white border-b-2 border-white'
                            :
                            ''
                        }
                    `}>Product
                </Link>
                <Link
                    to="/Agency/CustomPackage"
                    className={`block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5
                    ${
                        (location.pathname === "/Agency/CustomPackage") ||
                        (isActiveLink("/Agency/CustomPackageDetail/"))
                        ?
                        'text-white border-b-2 border-white'
                        :
                        ''
                    }
                    `}>Custom Package
                </Link>
                {/* <button onClick={() => logout()} className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-5'>Logout</button> */}
                {/* <button onClick={() => changeLanguage('en')} className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 rounded-full hover:text-white mr-5 rounded-full border-2 border-neutral-50 px-6 pb-[6px] pt-1' >English</button>
                <button onClick={() => changeLanguage('id')} className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 rounded-full hover:text-white mr-5 rounded-full border-2 border-neutral-50 px-6 pb-[6px] pt-1'>Indonesia</button> */}

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

                <DropdownMenu>
                    <DropdownMenuTrigger
                        className='text-teal-200 mx-5 hover:text-white'>
                            <div className={`
                                ${
                                    ((location.pathname === `/Agency/EditProfileAgency/${user?.account_id}`))
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
            </div>
        </nav>
      )
}

export default Navbar
