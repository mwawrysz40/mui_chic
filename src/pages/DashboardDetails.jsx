// src/pages/DashboardDetails.jsx
import React, { useEffect, useState } from 'react';
import {
    Grid, Typography, Box, Stack, Button, useTheme,
    Breadcrumbs, Link as MuiLink, Paper, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter
} from '@mui/material';
import { Assignment, CheckCircle, ArrowBack, NavigateNext, CalendarMonth } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import StatCard from '../components/dashboard/StatCard';
import { fetchGetCheck, fetchGetDataQ2 } from '../api/getCheck';

const MONTHS = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];

const PARAMETERS = [
    { key: "Stężenie", label: "Stężenie" }, { key: "Waga", label: "Waga" },
    { key: "Dropper", label: "Dropper" }, { key: "Butelka", label: "Butelka" },
    { key: "Nakrętka", label: "Nakrętka" }, { key: "Etykieta", label: "Etykieta" },
    { key: "Smak", label: "Smak" }, { key: "Zanieczyszczenia", label: "Zanieczyszczenia" },
    { key: "Wysokość", label: "Wysokość" }, { key: "MasterCase", label: "Mastercase" },
    { key: "OpJednostkowe", label: "Opakowanie jednostkowe" }, { key: "OpZbiorcze", label: "Opakowanie zbiorcze" },
    { key: "Banderola", label: "Banderola" }, { key: "Klej", label: "Klejenie opakowania" }, { key: "Ulotka", label: "Ulotka" },
];

export default function DashboardDetails() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [checkData, setCheckData] = useState([]);
    const [q2Data, setQ2Data] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMonth, setActiveMonth] = useState(-1);

    useEffect(() => {
        const loadAllData = async () => {
            try {
                const [resCheck, resQ2] = await Promise.all([fetchGetCheck(), fetchGetDataQ2()]);
                setCheckData(Array.isArray(resCheck) ? resCheck : []);
                setQ2Data(Array.isArray(resQ2) ? resQ2 : []);
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        loadAllData();
    }, []);

    const formatPct = (val) => `${(val || 0).toFixed(1)}%`.replace('.', ',');

    let tableRows = [];
    let firstColumnHeader = "Parametr";

    if (activeMonth === -1) {
        firstColumnHeader = "Miesiąc";
        tableRows = q2Data.map(mRow => {
            const rAvg = PARAMETERS.reduce((acc, p) => acc + parseFloat(mRow[`${p.key}R`] || 0), 0) / PARAMETERS.length;
            const aAvg = PARAMETERS.reduce((acc, p) => acc + parseFloat(mRow[`${p.key}A`] || 0), 0) / PARAMETERS.length;
            const gAvg = PARAMETERS.reduce((acc, p) => acc + parseFloat(mRow[`${p.key}G`] || 0), 0) / PARAMETERS.length;
            return { label: MONTHS[mRow.Miesiąc - 1], r: rAvg, a: aAvg, g: gAvg };
        });
    } else {
        const mData = q2Data.find(d => d.Miesiąc === activeMonth);
        tableRows = PARAMETERS.map((p, i) => ({
            id: i + 1, label: p.label,
            r: parseFloat(mData?.[`${p.key}R`] || 0),
            a: parseFloat(mData?.[`${p.key}A`] || 0),
            g: parseFloat(mData?.[`${p.key}G`] || 0)
        }));
    }

    const totalAvgR = tableRows.reduce((s, r) => s + r.r, 0) / (tableRows.length || 1);
    const totalAvgA = tableRows.reduce((s, r) => s + r.a, 0) / (tableRows.length || 1);
    const totalAvgG = tableRows.reduce((s, r) => s + r.g, 0) / (tableRows.length || 1);

    const filteredCheck = activeMonth === -1 ? checkData : checkData.filter(d => d.month === activeMonth);
    const totalSprawdzen = filteredCheck.reduce((acc, curr) => acc + (curr.sprawdzen || 0), 0);
    const totalSprawdzono = filteredCheck.reduce((acc, curr) => acc + (curr.sprawdzono || 0), 0);

    return (
        <PageLayout title="Monitoring Sprawdzeń"
                    hideToggle
                    headerExtra={<Button startIcon={<ArrowBack />} onClick={() => navigate('/')} variant="outlined" size="small">Powrót</Button>}>
            <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
                <MuiLink component={Link} underline="hover" color="inherit" to="/">Dashboard Główny</MuiLink>
                <Typography color="text.primary" sx={{ fontWeight: 700 }}>Monitoring Sprawdzeń</Typography>
            </Breadcrumbs>

            <Stack direction="row" spacing={1} sx={{ mb: 4, overflowX: 'auto', pb: 1 }}>
                <Button variant={activeMonth === -1 ? "contained" : "outlined"} onClick={() => setActiveMonth(-1)} size="small">Cały Rok</Button>
                {q2Data.map(d => <Button key={d.Miesiąc} variant={activeMonth === d.Miesiąc ? "contained" : "outlined"} onClick={() => setActiveMonth(d.Miesiąc)} size="small">{MONTHS[d.Miesiąc - 1]}</Button>)}
            </Stack>

            <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid item xs={12} md={6}>
                    <StatCard title="Zlecone Sprawdzenia" value={totalSprawdzen.toLocaleString()} icon={<Assignment />} color={theme.palette.primary.main} periodText={activeMonth === -1 ? "CAŁY ROK 2026" : `${MONTHS[activeMonth-1].toUpperCase()} 2026`} loading={loading} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <StatCard title="Zrealizowane Analizy" value={totalSprawdzono.toLocaleString()} icon={<CheckCircle />} color={theme.palette.success.main} periodText={activeMonth === -1 ? "CAŁY ROK 2026" : `${MONTHS[activeMonth-1].toUpperCase()} 2026`} loading={loading} />
                </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'text.secondary', fontSize: '1rem' }}>ZESTAWIENIE JAKOŚCIOWE (Q2)</Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, maxHeight: 600 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            {activeMonth !== -1 && <TableCell sx={{ fontWeight: 700, width: 60, backgroundColor: '#f8fafc' }}>SFG</TableCell>}
                            <TableCell sx={{ fontWeight: 700, backgroundColor: '#f8fafc' }}>{firstColumnHeader}</TableCell>
                            <TableCell align="center" sx={{ backgroundColor: '#ff0000', color: 'white', fontWeight: 700, width: 100, zIndex: 11 }}>R</TableCell>
                            <TableCell align="center" sx={{ backgroundColor: '#ffcc00', color: 'black', fontWeight: 700, width: 100, zIndex: 11 }}>A</TableCell>
                            <TableCell align="center" sx={{ backgroundColor: '#4472c4', color: 'white', fontWeight: 700, width: 100, zIndex: 11 }}>G</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableRows.map((row, idx) => (
                            <TableRow key={idx} hover>
                                {activeMonth !== -1 && <TableCell sx={{ color: 'text.secondary' }}>{row.id}.</TableCell>}
                                <TableCell sx={{ fontWeight: 500, fontStyle: activeMonth !== -1 ? 'italic' : 'normal' }}>{row.label}</TableCell>
                                <TableCell align="center">{formatPct(row.r)}</TableCell>
                                <TableCell align="center">{formatPct(row.a)}</TableCell>
                                <TableCell align="center">{formatPct(row.g)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    {activeMonth !== -1 && (
                        <TableFooter sx={{ position: 'sticky', bottom: 0, zIndex: 10 }}>
                            <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                                <TableCell sx={{ backgroundColor: '#f1f5f9' }} />
                                <TableCell align="right" sx={{ fontWeight: 700, pr: 4, backgroundColor: '#f1f5f9' }}>Średnia</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 800, backgroundColor: '#f1f5f9' }}>{formatPct(totalAvgR)}</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 800, backgroundColor: '#f1f5f9' }}>{formatPct(totalAvgA)}</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 800, backgroundColor: '#f1f5f9' }}>{formatPct(totalAvgG)}</TableCell>
                            </TableRow>
                        </TableFooter>
                    )}
                </Table>
            </TableContainer>
        </PageLayout>
    );
}