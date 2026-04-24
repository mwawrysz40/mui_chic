// src/components/dashboard/StatusTable.jsx
import React from 'react';
import { Box, Grid, Typography, LinearProgress, useTheme, Skeleton } from '@mui/material';

const MONTHS = [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
];

export default function StatusTable({ data, loading, activeMonth }) {
    const theme = useTheme();

    if (loading) {
        return (
            <Box sx={{ mt: 2 }}>
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} height={60} sx={{ mb: 1, borderRadius: 2 }} />
                ))}
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Grid container sx={{ px: 2, pb: 1, borderBottom: `1px solid ${theme.palette.divider}`, mb: 2 }}>
                <Grid item xs={3}><Typography variant="caption" fontWeight={700}>MIESIĄC</Typography></Grid>
                <Grid item xs={3}><Typography variant="caption" fontWeight={700}>ZLECONO</Typography></Grid>
                <Grid item xs={6}><Typography variant="caption" fontWeight={700}>POSTĘP</Typography></Grid>
            </Grid>

            {data.map((item) => {
                // Konwersja na liczbę i pobranie nazwy miesiąca
                const mIdx = parseInt(item.month) - 1;
                const monthName = MONTHS[mIdx] || `Miesiąc ${item.month}`;
                const pct = item.sprawdzen > 0 ? Math.round((item.sprawdzono / item.sprawdzen) * 100) : 0;
                const isActive = activeMonth === item.month;

                return (
                    <Box
                        key={item.month} // UNIKALNY KLUCZ
                        sx={{
                            p: 2, mb: 1, borderRadius: 2,
                            backgroundColor: isActive ? `${theme.palette.primary.main}15` : 'transparent',
                            border: isActive ? `1px solid ${theme.palette.primary.main}40` : '1px solid transparent'
                        }}
                    >
                        <Grid container alignItems="center">
                            <Grid item xs={3}>
                                <Typography variant="body2" fontWeight={isActive ? 700 : 500}>
                                    {monthName}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body2" color="primary.main" fontWeight={700}>
                                    {item.sprawdzen?.toLocaleString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={pct > 100 ? 100 : pct}
                                            sx={{ height: 10, borderRadius: 5 }}
                                        />
                                    </Box>
                                    <Typography variant="caption" fontWeight={700}>{pct}%</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                );
            })}
        </Box>
    );
}