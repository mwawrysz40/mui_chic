import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'


const Dashboard = lazy(() => import('./pages/Dashboard'))
const Probki = lazy(() => import('./pages/Probki'))
const WynikProbek = lazy(() => import('./pages/WynikiProbek'))


export default function App() {
    return (
        <Layout>
            <Suspense fallback={<div>Ładowanie...</div>}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/probki" element={<Probki />} />
                    <Route path="/wyniki" element={<WynikProbek />} />
                </Routes>
            </Suspense>
        </Layout>
    )
}