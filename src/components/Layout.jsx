// src/components/Layout.jsx
import React from 'react'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { DRAWER_WIDTH } from '../config/constants'

export default function Layout({ children }) {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Header />
            <Sidebar />

            <Box
                component="main"
                sx={{
                    flexGrow:   1,
                    minWidth:   0,        // kluczowe — pozwala flexbox dziecku się kurczyć
                    overflow:   'hidden', // main nie scrolluje — scrolluje TableContainer
                    display:    'flex',
                    flexDirection: 'column',
                    minHeight:  '100vh',
                }}
            >
                <Toolbar /> {/* odstęp pod fixed AppBar */}
                <Box sx={{ flexGrow: 1, p: 3, minWidth: 0 }}>
                    {children}
                </Box>
                <Footer />
            </Box>
        </Box>
    )
}