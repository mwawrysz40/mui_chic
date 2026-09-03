import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardHub from './pages/DashboardHub';
import DashboardDetails from './pages/DashboardDetails';
import RequireAccess from './auth/RequireAccess';
import NoAccess from './components/NoAccess';
import { useAccess } from './auth/access';


// const Dashboard = lazy(() => import('./pages/Dashboard'))
const Probki = lazy(() => import('./pages/Probki'))
const WynikProbek = lazy(() => import('./pages/WynikiProbek'))
// const Mrp = lazy(() => import('./pages/Mrp')) // MRP tymczasowo wyłączone
const Ewidencje = lazy(() => import('./pages/Ewidencje'))
const Banderole = lazy(() => import('./pages/Banderole'))
const ZleceniaProdukcyjne = lazy(() => import('./pages/ZleceniaProdukcyjne'))
const RaportMiesieczny = lazy(() => import('./pages/RaportMiesieczny'))
const RaportRw = lazy(() => import('./pages/RaportRw'))
const WykresRwPw = lazy(() => import('./pages/WykresRwPw'))


// Użytkownik bez grupy Laboratorium nie zobaczy Dashboardu — kierujemy go
// na pierwszą stronę, do której ma uprawnienia (np. Ewidencje dla Akcyzy).
function HomeRoute() {
    const { canAccessPath, firstPath } = useAccess()

    if (canAccessPath('/')) return <DashboardHub />
    if (firstPath) return <Navigate to={firstPath} replace />

    return <NoAccess />
}


export default function App() {
    return (
        <Layout>
            <Suspense fallback={<div>Ładowanie...</div>}>
                <Routes>
                    <Route path="/" element={<HomeRoute />} />
                    <Route path="/dashboard/checks" element={<RequireAccess><DashboardDetails /></RequireAccess>} />
                    <Route path="/probki"    element={<RequireAccess><Probki /></RequireAccess>} />
                    <Route path="/wyniki"    element={<RequireAccess><WynikProbek /></RequireAccess>} />
                    <Route path="/ewidencje" element={<RequireAccess><Ewidencje /></RequireAccess>} />
                    <Route path="/banderole" element={<RequireAccess><Banderole /></RequireAccess>} />
                    {/* MRP tymczasowo wyłączone — patrz zakomentowana pozycja w config/navigation.js
                    <Route path="/mrp"       element={<RequireAccess><Mrp /></RequireAccess>} />
                    */}
                    <Route path="/zlecenia"  element={<RequireAccess><ZleceniaProdukcyjne /></RequireAccess>} />
                    <Route path="/produkcja/raport-miesieczny" element={<RequireAccess><RaportMiesieczny /></RequireAccess>} />
                    <Route path="/produkcja/raport-rw"         element={<RequireAccess><RaportRw /></RequireAccess>} />
                    <Route path="/produkcja/wykres-rw"         element={<RequireAccess><WykresRwPw /></RequireAccess>} />
                </Routes>
            </Suspense>
        </Layout>
    )
}