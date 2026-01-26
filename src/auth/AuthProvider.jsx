import React, { createContext, useContext, useState } from 'react'


const AuthContext = createContext()


export function AuthProvider({ children }) {
// tymczasowy użytkownik — w przyszłości podmienisz logikę na Keycloak
    const [user, setUser] = useState({ username: 'Jan Kowalski' })


    const logout = () => {
// tutaj wywołasz Keycloak logout
        setUser(null)
// możesz przekierować po wylogowaniu
        window.location.href = '/'
    }


    return (
        <AuthContext.Provider value={{ user, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext)