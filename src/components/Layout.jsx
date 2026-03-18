import React from 'react'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { DRAWER_WIDTH } from '../config/constants'




// Updated Layout to push Footer to the bottom
export default function Layout({ children }) {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Header drawerWidth={DRAWER_WIDTH} />
            <Sidebar drawerWidth={DRAWER_WIDTH} />


            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Toolbar />
                <Box sx={{ flexGrow: 1 }}>
                    {children}
                </Box>
                <Footer />
            </Box>
        </Box>
    )
}