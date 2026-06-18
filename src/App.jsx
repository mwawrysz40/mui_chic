import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardHub from './pages/DashboardHub';
import DashboardDetails from './pages/DashboardDetails';


// const Dashboard = lazy(() => import('./pages/Dashboard'))
const Probki = lazy(() => import('./pages/Probki'))
const WynikProbek = lazy(() => import('./pages/WynikiProbek'))
// Ukryte na produkcji — backend gotowy, front wyłączony do czasu wdrożenia
// const Mrp = lazy(() => import('./pages/Mrp'))
// const Ewidencje = lazy(() => import('./pages/Ewidencje'))


export default function App() {
    return (
        <Layout>
            <Suspense fallback={<div>Ładowanie...</div>}>
                <Routes>
                    <Route path="/" element={<DashboardHub />} />
                    <Route path="/dashboard/checks" element={<DashboardDetails />} />
                    <Route path="/probki" element={<Probki />} />
                    <Route path="/wyniki" element={<WynikProbek />} />
                    {/* Ukryte na produkcji — odkomentuj wraz z importami powyżej */}
                    {/* <Route path="/mrp" element={<Mrp />} /> */}
                    {/* <Route path="/ewidencje" element={<Ewidencje />} /> */}
                </Routes>
            </Suspense>
        </Layout>
    )
}