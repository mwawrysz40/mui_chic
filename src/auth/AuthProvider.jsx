// src/auth/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import keycloak from './keycloak'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [authenticated, setAuthenticated] = useState(false)
    const [loading, setLoading]             = useState(true)
    const [user, setUser]                   = useState(null)

    useEffect(() => {
        // Keycloak nie może być inicjalizowany więcej niż raz —
        // w React StrictMode useEffect odpala się dwa razy w dev,
        // więc sprawdzamy czy instancja nie jest już gotowa.
        if (keycloak.didInitialize) {
            setAuthenticated(keycloak.authenticated)
            if (keycloak.authenticated) {
                setUser({
                    username:  keycloak.tokenParsed?.preferred_username || '',
                    firstName: keycloak.tokenParsed?.given_name         || '',
                    lastName:  keycloak.tokenParsed?.family_name        || '',
                    email:     keycloak.tokenParsed?.email              || '',
                    roles:     keycloak.tokenParsed?.realm_access?.roles || [],
                    groups:    keycloak.tokenParsed?.groups              || [],
                })
            }
            setLoading(false)
            return
        }

        keycloak
            .init({
                onLoad:           'login-required',
                checkLoginIframe: false,
            })
            .then((auth) => {
                setAuthenticated(auth)
                if (auth) {
                    setUser({
                        username:  keycloak.tokenParsed?.preferred_username || '',
                        firstName: keycloak.tokenParsed?.given_name         || '',
                        lastName:  keycloak.tokenParsed?.family_name        || '',
                        email:     keycloak.tokenParsed?.email              || '',
                        roles:     keycloak.tokenParsed?.realm_access?.roles || [],
                        groups:    keycloak.tokenParsed?.groups              || [],
                    })
                }
            })
            .catch((err) => {
                console.error('Keycloak init error:', err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    // Odśwież token 60 sekund przed wygaśnięciem —
    // żeby użytkownik pracujący długo nie dostał 401
    useEffect(() => {
        if (!authenticated) return

        const interval = setInterval(() => {
            keycloak
                .updateToken(60)
                .catch(() => {
                    console.warn('Token refresh failed — wylogowywanie')
                    keycloak.logout()
                })
        }, 30_000) // sprawdzaj co 30s

        return () => clearInterval(interval)
    }, [authenticated])

    const logout = () => {
        keycloak.logout({
            redirectUri: window.location.origin,
        })
    }

    // Pełnoekranowy spinner podczas inicjalizacji Keycloak —
    // użytkownik nie widzi żadnej treści przed autentykacją
    if (loading) {
        return (
            <Box sx={{
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                justifyContent: 'center',
                minHeight:      '100vh',
                gap:            2,
            }}>
                <CircularProgress size={32} />
                <Typography variant="body2" color="text.secondary">
                    Łączenie z systemem autoryzacji...
                </Typography>
            </Box>
        )
    }

    return (
        <AuthContext.Provider value={{ user, authenticated, logout, keycloak }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)