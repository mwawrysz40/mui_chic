// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import {
    Grid, Paper, Typography, Box, Card, CardContent,
    LinearProgress, Skeleton, useTheme, Button, Stack
} from '@mui/material';
import {
    Assignment, CheckCircle, TrendingUp
} from '@mui/icons-material';
import PageLayout from '../components/PageLayout';
import { fetchGetCheck } from '../api/getCheck'; // Upewnij się, że ścieżka do getCheck.js jest poprawna

const MONTHS = [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
];

export default function Dashboard() {
    const theme = useTheme();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMonth, setActiveMonth] = useState(-1); // -1 oznacza cały rok

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetchGetCheck();
                setData(res);
            } catch (err) {
                console.error("Błąd ładowania danych dashboardu:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Obliczenia KPI
    const filteredData = activeMonth === -1
        ? data
        : data.filter(d => d.month === activeMonth);

    const totalSprawdzen = filteredData.reduce((acc, curr) => acc + curr.sprawdzen, 0);
    const totalSprawdzono = filteredData.reduce((acc, curr) => acc + curr.sprawdzono, 0);
    const progress = totalSprawdzen > 0 ? Math.round((totalSprawdzono / totalSprawdzen) * 100) : 0;

    const StatCard = ({ title, value, icon, color }) => (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ mt: 1 }}>
                            {loading ? <Skeleton width={80} /> : value.toLocaleString()}
                        </Typography>
                    </Box>
                    <Box sx={{
                        backgroundColor: `${color}15`,
                        color: color,
                        p: 1.5,
                        borderRadius: 2,
                        display: 'flex'
                    }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <PageLayout title="Centrum Analityki i Monitoringu">
            <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1 }}>
                    <Button
                        variant={activeMonth === -1 ? "contained" : "outlined"}
                        onClick={() => setActiveMonth(-1)}
                        size="small"
                    >
                        Cały Rok
                    </Button>
                    {data.map((d) => (
                        <Button
                            key={d.month}
                            variant={activeMonth === d.month ? "contained" : "outlined"}
                            onClick={() => setActiveMonth(d.month)}
                            size="small"
                        >
                            {MONTHS[d.month - 1]}
                        </Button>
                    ))}
                </Stack>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <StatCard
                            title="Zlecone Sprawdzenia"
                            value={totalSprawdzen}
                            icon={<Assignment />}
                            color={theme.palette.primary.main}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatCard
                            title="Zrealizowane Analizy"
                            value={totalSprawdzono}
                            icon={<CheckCircle />}
                            color={theme.palette.success.main}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatCard
                            title="Wydajność Procesu"
                            value={`${progress}%`}
                            icon={<TrendingUp />}
                            color={theme.palette.warning.main}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3 }}>Szczegóły Miesięczne</Typography>
                            <Box>
                                <Grid container sx={{ borderBottom: `1px solid ${theme.palette.divider}`, pb: 1, mb: 2, px: 2 }}>
                                    <Grid item xs={3}><Typography variant="caption" fontWeight={700}>MIESIĄC</Typography></Grid>
                                    <Grid item xs={3}><Typography variant="caption" fontWeight={700}>ZLECONO</Typography></Grid>
                                    <Grid item xs={6}><Typography variant="caption" fontWeight={700}>POSTĘP REALIZACJI</Typography></Grid>
                                </Grid>

                                {loading ? [1,2,3].map(i => <Skeleton key={i} height={60} sx={{ mb: 1 }} />) :
                                    data.map((item) => {
                                        const itemPct = Math.round((item.sprawdzono / item.sprawdzen) * 100);
                                        const isActive = activeMonth === item.month;

                                        return (
                                            <Box key={item.month} sx={{
                                                p: 2, mb: 1, borderRadius: 2,
                                                backgroundColor: isActive ? `${theme.palette.primary.main}10` : 'transparent',
                                                border: isActive ? `1px solid ${theme.palette.primary.main}30` : '1px solid transparent'
                                            }}>
                                                <Grid container alignItems="center">
                                                    <Grid item xs={3}>
                                                        <Typography variant="body2" fontWeight={isActive ? 700 : 400}>
                                                            {MONTHS[item.month - 1]}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Typography variant="body2" color="primary" fontWeight={600}>
                                                            {item.sprawdzen}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Box display="flex" alignItems="center" gap={2}>
                                                            <Box sx={{ flexGrow: 1 }}>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={itemPct}
                                                                    sx={{ height: 8, borderRadius: 4 }}
                                                                />
                                                            </Box>
                                                            <Typography variant="caption" sx={{ minWidth: 35 }}>
                                                                {itemPct}%
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        );
                                    })}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </PageLayout>
    );
}