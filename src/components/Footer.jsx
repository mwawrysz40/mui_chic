import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function Footer() {
    return (
        <Box component="footer" sx={{ py: 0.5, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption">© {new Date().getFullYear()} Chic ERP</Typography>
        </Box>
    )
}