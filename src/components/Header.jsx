import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
//import logo from '../assets/logo_chic.png'
import { useAuth } from '../auth/AuthProvider'
import UserMenu from './UserMenu'


export default function Header() {
    const { user } = useAuth()

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                {/* Logo jako osobny element */}

                {/*<Box*/}
                {/*    component="img"*/}
                {/*    src={logo}*/}
                {/*    alt="Logo Chic"*/}
                {/*    sx={{*/}
                {/*        height: 40,       // Możesz teraz nieco zwiększyć, bo nie ma białej ramki*/}
                {/*        width: 'auto',*/}
                {/*        marginRight: 2,*/}
                {/*        cursor: 'pointer',*/}
                {/*        filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))', // Opcjonalnie: lekki cień samej grafiki*/}
                {/*        transition: 'transform 0.2s',*/}
                {/*        '&:hover': {*/}
                {/*            transform: 'scale(1.1)',*/}
                {/*        }*/}
                {/*    }}*/}
                {/*/>*/}

                {/* Tytuł jako osobny element obok logo */}
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    ESL Portal
                </Typography>

                <UserMenu username={user?.username} />
            </Toolbar>
        </AppBar>
    )
}