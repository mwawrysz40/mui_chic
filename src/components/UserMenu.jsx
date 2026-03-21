// src/components/UserMenu.jsx
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Logout from '@mui/icons-material/Logout'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { useAuth } from '../auth/AuthProvider'

export default function UserMenu() {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const { user, logout } = useAuth()

    const handleOpen  = (e) => setAnchorEl(e.currentTarget)
    const handleClose = () => setAnchorEl(null)

    // Inicjały do avatara — pierwsza litera imienia + nazwiska
    const initials = [user?.firstName, user?.lastName]
        .filter(Boolean)
        .map(s => s[0].toUpperCase())
        .join('') || user?.username?.[0]?.toUpperCase() || '?'

    // Pełne imię i nazwisko albo username jako fallback
    const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
        || user?.username
        || 'Użytkownik'

    return (
        <>
            <IconButton
                onClick={handleOpen}
                size="small"
                sx={{
                    border: 'none',
                    background: 'transparent',
                    boxShadow: 'none',
                    '&:hover': { background: 'rgba(0,0,0,0.04)', border: 'none', boxShadow: 'none' },
                }}
            >
                <Avatar sx={{
                    width:      30,
                    height:     30,
                    fontSize:   '12px',
                    fontWeight: 600,
                    bgcolor:    'primary.main',
                }}>
                    {initials}
                </Avatar>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: { minWidth: 200, mt: 0.5 },
                    },
                }}
            >
                {/* Info o użytkowniku */}
                <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <PersonOutlineIcon fontSize="small" sx={{ color: 'text.muted', mt: '2px', flexShrink: 0 }} />
                    <Box>
                        <Typography variant="body2" fontWeight={500} color="text.primary">
                            {displayName}
                        </Typography>
                        {user?.email && (
                            <Typography variant="caption" color="text.secondary">
                                {user.email}
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Divider />

                <MenuItem onClick={logout} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <Logout fontSize="small" sx={{ color: 'error.main' }} />
                    </ListItemIcon>
                    Wyloguj
                </MenuItem>
            </Menu>
        </>
    )
}