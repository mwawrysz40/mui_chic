// src/pages/DashboardDetails.jsx
import React, { useEffect, useState } from 'react';
import {
    Grid,
    Typography,
    Box,
    Stack,
    Button,
    useTheme,
    Breadcrumbs,
    Link as MuiLink
} from '@mui/material';
import {
    Assignment,
    CheckCircle,
    ArrowBack,
    NavigateNext,
    CalendarMonth
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';

import PageLayout from '../components/PageLayout';
import StatCard from '../components/dashboard/StatCard';
import { fetchGetCheck } from '../api/getCheck';

const MONTHS = [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
];

export default function DashboardDetails() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMonth, setActiveMonth] = useState(-1);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetchGetCheck();
                setData(Array.isArray(res) ? res : []);
            } catch (err) {
                console.error("Błąd ładowania danych:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Określenie tekstu wybranego okresu
    const currentYear = data.length > 0 ? data[0].year : 2025;
    const periodText = activeMonth === -1
        ? `CAŁY ROK ${currentYear}`
        : `${MONTHS[activeMonth - 1].toUpperCase()} ${currentYear}`;

    const filteredData = activeMonth === -1
        ? data
        : data.filter(d => d.month === activeMonth);

    const totalSprawdzen = filteredData.reduce((acc, curr) => acc + (curr.sprawdzen || 0), 0);
    const totalSprawdzono = filteredData.reduce((acc, curr) => acc + (curr.sprawdzono || 0), 0);

    return (
        <PageLayout
            title="Monitoring Sprawdzeń"
            headerExtra={
                /* KLUCZOWY PRZYCISK POWROTU */
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/')}
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Powrót do Hubu
                </Button>
            }
        >
            {/* NAWIGACJA OKRUSZKOWA - dodatkowa metoda powrotu */}
            <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                sx={{ mb: 3 }}
            >
                <MuiLink
                    component={Link}
                    underline="hover"
                    color="inherit"
                    to="/"
                    sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}
                >
                    Dashboard Główny
                </MuiLink>
                <Typography color="text.primary" sx={{ fontWeight: 700 }}>
                    Monitoring Sprawdzeń
                </Typography>
            </Breadcrumbs>

            <Box sx={{ mb: 4 }}>
                {/* Selektor miesięcy */}
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        mb: 4,
                        overflowX: 'auto',
                        pb: 1,
                        '&::-webkit-scrollbar': { height: 6 },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: 10 }
                    }}
                >
                    <Button
                        key="btn-all-periods"
                        variant={activeMonth === -1 ? "contained" : "outlined"}
                        onClick={() => setActiveMonth(-1)}
                        size="small"
                    >
                        Cały Rok
                    </Button>
                    {!loading && data.map((d, index) => (
                        <Button
                            key={`month-btn-${d.month || index}`}
                            variant={activeMonth === d.month ? "contained" : "outlined"}
                            onClick={() => setActiveMonth(d.month)}
                            size="small"
                        >
                            {MONTHS[d.month - 1] || `M-ce ${d.month}`}
                        </Button>
                    ))}
                </Stack>

                {/* Nagłówek informacyjny */}
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarMonth sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                        WYBRANY OKRES: <span style={{ color: theme.palette.primary.main }}>{periodText}</span>
                    </Typography>
                </Box>

                {/* Kafelki KPI */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <StatCard
                            title="Ilość sprawdzeń"
                            value={totalSprawdzen.toLocaleString()}
                            icon={<Assignment />}
                            color={theme.palette.primary.main}
                            periodText={periodText}
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <StatCard
                            title="Ilość sprawdzona"
                            value={totalSprawdzono.toLocaleString()}
                            icon={<CheckCircle />}
                            color={theme.palette.success.main}
                            periodText={periodText}
                            loading={loading}
                        />
                    </Grid>
                </Grid>
            </Box>
        </PageLayout>
    );
}