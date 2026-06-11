import React, { useState } from 'react';
import {
    Grid, Typography, Box, Stack, Button, useTheme,
    Breadcrumbs, Link as MuiLink, Paper, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter
} from '@mui/material';
import { Assignment, CheckCircle, ArrowBack, NavigateNext } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import PageLayout from '../components/PageLayout';
import StatCard from '../components/dashboard/StatCard';
import { useChecks, useDataQ2 } from '../hooks/queries';

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
    const { data: rawCheck, isLoading: loadingCheck } = useChecks();
    const { data: rawQ2, isLoading: loadingQ2 } = useDataQ2();
    const checkData = Array.isArray(rawCheck) ? rawCheck : [];
    const q2Data = Array.isArray(rawQ2) ? rawQ2 : [];
    const loading = loadingCheck || loadingQ2;
    const [activeMonth, setActiveMonth] = useState(-1);

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
        <PageLayout
            title="Monitoring Sprawdzeń"
            hideToggle
            headerExtra={
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} variant="outlined" size="small">
                    Powrót
                </Button>
            }
        >
            {/* Ten kontener naprawia problem ucinania treści na laptopach[cite: 3] */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, mt: 1 }}>

                <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 2 }}>
                    <MuiLink component={Link} underline="hover" color="inherit" to="/">Dashboard Główny</MuiLink>
                    <Typography color="text.primary" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Monitoring Sprawdzeń</Typography>
                </Breadcrumbs>

                <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1, minHeight: '45px' }}>
                    <Button variant={activeMonth === -1 ? "contained" : "outlined"} onClick={() => setActiveMonth(-1)} size="small">Cały Rok</Button>
                    {q2Data.map(d => (
                        <Button key={d.Miesiąc} variant={activeMonth === d.Miesiąc ? "contained" : "outlined"} onClick={() => setActiveMonth(d.Miesiąc)} size="small">
                            {MONTHS[d.Miesiąc - 1]}
                        </Button>
                    ))}
                </Stack>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <StatCard
                            title="Zlecone Sprawdzenia"
                            value={totalSprawdzen.toLocaleString()}
                            icon={<Assignment />}
                            color={theme.palette.primary.main}
                            periodText={activeMonth === -1 ? "CAŁY ROK 2026" : `${MONTHS[activeMonth-1].toUpperCase()} 2026`}
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <StatCard
                            title="Zrealizowane Analizy"
                            value={totalSprawdzono.toLocaleString()}
                            icon={<CheckCircle />}
                            color={theme.palette.success.main}
                            periodText={activeMonth === -1 ? "CAŁY ROK 2026" : `${MONTHS[activeMonth-1].toUpperCase()} 2026`}
                            loading={loading}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} lg={6}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'text.secondary', fontSize: '0.9rem' }}>
                            ZESTAWIENIE JAKOŚCIOWE (Q2)
                        </Typography>
                        <TableContainer component={Paper} sx={{ borderRadius: 3, height: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'auto' }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {activeMonth !== -1 && <TableCell sx={{ fontWeight: 700, width: 40, backgroundColor: '#f8fafc', fontSize: '0.75rem' }}>SFG</TableCell>}
                                        <TableCell sx={{ fontWeight: 700, backgroundColor: '#f8fafc', fontSize: '0.75rem' }}>{firstColumnHeader}</TableCell>
                                        <TableCell align="center" sx={{ backgroundColor: '#ff0000', color: 'white', fontWeight: 700, width: 75, zIndex: 11, fontSize: '0.75rem' }}>R</TableCell>
                                        <TableCell align="center" sx={{ backgroundColor: '#ffcc00', color: 'black', fontWeight: 700, width: 75, zIndex: 11, fontSize: '0.75rem' }}>A</TableCell>
                                        <TableCell align="center" sx={{ backgroundColor: '#52c444', color: 'white', fontWeight: 700, width: 75, zIndex: 11, fontSize: '0.75rem' }}>G</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableRows.map((row, idx) => (
                                        <TableRow key={idx} hover>
                                            {activeMonth !== -1 && <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>{row.id}.</TableCell>}
                                            <TableCell sx={{ fontWeight: 500, fontSize: '0.75rem' }}>{row.label}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{formatPct(row.r)}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{formatPct(row.a)}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{formatPct(row.g)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                {activeMonth !== -1 && (
                                    <TableFooter sx={{ position: 'sticky', bottom: 0, zIndex: 10, backgroundColor: '#f1f5f9' }}>
                                        <TableRow>
                                            <TableCell sx={{ backgroundColor: '#f1f5f9', borderTop: '2px solid #e2e8f0' }} />
                                            <TableCell align="right" sx={{ fontWeight: 700, pr: 2, backgroundColor: '#f1f5f9', fontSize: '0.8rem', borderTop: '2px solid #e2e8f0' }}>Średnia</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 800, backgroundColor: '#f1f5f9', fontSize: '0.8rem', borderTop: '2px solid #e2e8f0' }}>{formatPct(totalAvgR)}</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 800, backgroundColor: '#f1f5f9', fontSize: '0.8rem', borderTop: '2px solid #e2e8f0' }}>{formatPct(totalAvgA)}</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 800, backgroundColor: '#f1f5f9', fontSize: '0.8rem', borderTop: '2px solid #e2e8f0' }}>{formatPct(totalAvgG)}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                )}
                            </Table>
                        </TableContainer>
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'text.secondary', fontSize: '0.9rem' }}>
                            ANALIZA WIZUALNA Q2
                        </Typography>
                        <Paper sx={{ p: 2, borderRadius: 3, height: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    layout="vertical"
                                    data={[...tableRows].reverse()}
                                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" domain={[0, 100]} tickFormatter={(val) => `${val}%`} fontSize={10} />
                                    <YAxis dataKey="label" type="category" width={110} fontSize={9} stroke="#64748b" />
                                    <Tooltip
                                        formatter={(value) => [`${value.toFixed(1)}%`, '']}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '0.8rem' }}
                                    />
                                    <Legend verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: '10px', fontSize: '0.75rem' }} />
                                    <Bar dataKey="r" name="R" stackId="rag" fill="#ff0000" barSize={12} />
                                    <Bar dataKey="a" name="A" stackId="rag" fill="#ffcc00" barSize={12} />
                                    <Bar dataKey="g" name="G" stackId="rag" fill="#52c444" barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={{ height: 60 }} />
            </Box>
        </PageLayout>
    );
}