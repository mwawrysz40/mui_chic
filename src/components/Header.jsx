// src/components/Header.jsx
import React, { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Logout from '@mui/icons-material/Logout'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

const PAGE_TITLES = {
    '/':       { title: 'Dashboard',               sub: 'Przegląd systemu i statystyki' },
    '/probki': { title: 'Ewidencja Próbek Laboratoryjnych', sub: 'Zarządzanie próbkami i seriami badawczymi' },
    '/wyniki': { title: 'Wyniki Analiz',                    sub: 'Przeglądanie i edycja wyników badań' },
}

export default function Header() {
    const { user, logout } = useAuth()
    const location         = useLocation()
    const page             = PAGE_TITLES[location.pathname] || { title: 'CHIC ERP', sub: '' }

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleOpen  = (e) => setAnchorEl(e.currentTarget)
    const handleClose = () => setAnchorEl(null)
    const handleLogout = () => { handleClose(); logout() }

    const hasFullName = user?.firstName?.trim() && user?.lastName?.trim()
    const displayName = hasFullName
        ? `${user.firstName} ${user.lastName}`
        : user?.username || 'Użytkownik'
    const initials = hasFullName
        ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        : user?.username?.[0]?.toUpperCase() || '?'

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar sx={{ gap: 2 }}>

                {/* Tytuł strony */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{
                        fontSize:      '17px',
                        fontWeight:    700,
                        color:         'text.primary',
                        letterSpacing: '-0.3px',
                        lineHeight:    1.2,
                        whiteSpace:    'nowrap',
                        overflow:      'hidden',
                        textOverflow:  'ellipsis',
                    }}>
                        {page.title}
                    </Typography>
                    {page.sub && (
                        <Typography sx={{ fontSize: '11.5px', color: 'text.disabled', mt: '1px' }}>
                            {page.sub}
                        </Typography>
                    )}
                </Box>

                {/* Karta użytkownika — cały Box jest klikalny */}
                <Box
                    onClick={handleOpen}
                    sx={{
                        display:      'flex',
                        alignItems:   'center',
                        gap:          1.2,
                        pl:           1.5,
                        pr:           1,
                        py:           0.6,
                        borderRadius: '24px',
                        border:       '1px solid',
                        borderColor:  open ? 'primary.main' : 'divider',
                        cursor:       'pointer',
                        userSelect:   'none',
                        transition:   'all 0.15s',
                        bgcolor:      open ? '#f5f3ff' : 'transparent',
                        '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor:     '#f5f3ff',
                        },
                    }}
                >
                    {/* Imię + rola */}
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{
                            fontSize:   '13px',
                            fontWeight: 600,
                            color:      'text.primary',
                            lineHeight: 1.2,
                        }}>
                            {displayName}
                        </Typography>
                        <Typography sx={{
                            fontSize:  '11px',
                            color:     'text.secondary',
                            lineHeight: 1.2,
                        }}>
                            {user?.email || 'Laborant'}
                        </Typography>
                    </Box>

                    {/* Avatar */}
                    <Avatar sx={{
                        width:      30,
                        height:     30,
                        fontSize:   '12px',
                        fontWeight: 700,
                        bgcolor:    'primary.main',
                    }}>
                        {initials}
                    </Avatar>

                    {/* Strzałka sygnalizująca menu */}
                    <KeyboardArrowDownIcon sx={{
                        fontSize:   16,
                        color:      'text.disabled',
                        transition: 'transform 0.2s',
                        transform:  open ? 'rotate(180deg)' : 'rotate(0deg)',
                    }} />
                </Box>

                {/* Menu — pojawia się pod kartą */}
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    slotProps={{
                        paper: { elevation: 0, sx: { minWidth: 220, mt: 0.5 } },
                    }}
                >
                    {/* Info o użytkowniku */}
                    <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <PersonOutlineIcon fontSize="small" sx={{ color: 'text.secondary', mt: '2px', flexShrink: 0 }} />
                        <Box>
                            <Typography variant="body2" fontWeight={600} color="text.primary">
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

                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main', mt: 0.5 }}>
                        <Logout fontSize="small" sx={{ mr: 1.5, color: 'error.main' }} />
                        Wyloguj
                    </MenuItem>
                </Menu>

            </Toolbar>
        </AppBar>
    )
}