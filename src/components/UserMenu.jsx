import React, { useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Logout from '@mui/icons-material/Logout'
import Typography from '@mui/material/Typography'
import { useAuth } from '../auth/AuthProvider'


export default function UserMenu({ username }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const { logout } = useAuth()


    const handleOpen = (e) => setAnchorEl(e.currentTarget)
    const handleClose = () => setAnchorEl(null)


    return (
        <>
            <IconButton onClick={handleOpen} size="small" sx={{ ml: 1 }}>
                <Avatar>{username ? username[0] : '?'}</Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1">{username || 'Użytkownik'}</Typography>
                </Box>
                <MenuItem onClick={() => logout()}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Wyloguj
                </MenuItem>
            </Menu>
        </>
    )
}