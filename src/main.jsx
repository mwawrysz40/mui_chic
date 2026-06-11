// src/main.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import theme from './theme'
import { AuthProvider } from './auth/AuthProvider'
import { DictionaryProvider } from './hooks/useDictionary'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient'

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <DictionaryProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </ThemeProvider>
                </DictionaryProvider>
            </QueryClientProvider>
        </AuthProvider>
    </React.StrictMode>
)