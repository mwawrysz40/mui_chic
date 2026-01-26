import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Box from '@mui/material/Box'
import { useAuth } from '../auth/AuthProvider'
import UserMenu from './UserMenu'


export default function Header() {
    const { user } = useAuth()


    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" noWrap component="div">
                        Chic ERP
                    </Typography>
                </Box>


                <UserMenu username={user?.username} />
            </Toolbar>
        </AppBar>
    )
}