import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'


export default function Footer() {
    return (
        <Box component="footer" sx={{ mt: 4, py: 2, textAlign: 'center' }}>
            <Typography variant="caption">© {new Date().getFullYear()} Chic ERP</Typography>
        </Box>
    )
}