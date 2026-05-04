import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Assignment, Science, BarChart, Settings } from '@mui/icons-material';
import PageLayout from '../components/PageLayout';
import StatCard from '../components/dashboard/StatCard';

export default function DashboardHub() {
    const navigate = useNavigate();

    const modules = [
        {
            id: 'checks',
            title: 'Monitoring Sprawdzeń',
            val: 'Aktywny',
            icon: <Assignment />,
            path: '/dashboard/checks',
            color: '#7c3aed'
        },
        // {
        //     id: 'lab',
        //     title: 'Analizy Laboratoryjne',
        //     val: '24 oczekujących',
        //     icon: <Science />,
        //     path: '/wyniki',
        //     color: '#10b981'
        // },
        // {
        //     id: 'stats',
        //     title: 'Statystyki Wydajności',
        //     val: '89%',
        //     icon: <BarChart />,
        //     path: '/dashboard/checks', // Możesz potem zmienić
        //     color: '#3b82f6'
        // },
        // {
        //     id: 'admin',
        //     title: 'Konfiguracja Systemu',
        //     val: 'OK',
        //     icon: <Settings />,
        //     path: '#',
        //     color: '#64748b'
        // }
    ];

    return (
        <PageLayout title="Centrum Analiz" hideToggle>
            <Box sx={{ py: 2 }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Wybierz moduł, aby przejść do szczegółowych danych analitycznych.
                </Typography>

                <Grid container spacing={3}>
                    {modules.map((m) => (
                        <Grid item xs={12} sm={6} md={3} key={m.id}>
                            <StatCard
                                title={m.title}
                                value={m.val}
                                icon={m.icon}
                                color={m.color}
                                onClick={() => navigate(m.path)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </PageLayout>
    );
}