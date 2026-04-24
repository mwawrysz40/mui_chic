// src/components/dashboard/StatCard.jsx
import React from 'react';
import { Card, CardContent, Box, Typography, Skeleton } from '@mui/material';

export default function StatCard({ title, value, icon, color, periodText, onClick, loading }) {
    return (
        <Card
            onClick={onClick}
            sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s ease-in-out',
                '&:hover': onClick ? {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)'
                } : {}
            }}
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 800, color: 'text.primary' }}>
                            {loading ? <Skeleton width={100} /> : value}
                        </Typography>

                        {!loading && periodText && (
                            <Typography variant="caption" sx={{ color: color, fontWeight: 600, display: 'block', mt: 0.5 }}>
                                {periodText}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ backgroundColor: `${color}15`, color: color, p: 1.5, borderRadius: 2 }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}