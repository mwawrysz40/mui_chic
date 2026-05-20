// src/components/ResultFilters.jsx
import React from "react";
import { Box, TextField, MenuItem, Grid, Paper, Button, Typography } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function ResultFilters({ filters, setFilters }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setFilters({
            search: "",
            status: "",
            batch: "",
            dateFrom: "",
            dateTo: "",
        });
    };

    return (
        <Paper sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#666', fontWeight: 'bold' }}>
                Filtrowanie listy
            </Typography>

            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Szukaj (tekst)"
                        name="search"
                        value={filters.search}
                        onChange={handleChange}
                        size="small"
                        placeholder="Np. nazwa, nr próbki..."
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <TextField
                        select
                        fullWidth
                        label="Status"
                        name="status"
                        value={filters.status}
                        onChange={handleChange}
                        size="small"
                    >
                        <MenuItem value="">Wszystkie</MenuItem>
                        <MenuItem value="ZWOLNIONY">ZWOLNIONY</MenuItem>
                        <MenuItem value="ZABLOKOWANY">ZABLOKOWANY</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Partia"
                        name="batch"
                        value={filters.batch}
                        onChange={handleChange}
                        size="small"
                    />
                </Grid>

                <Grid item xs={12} md={2}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="inherit"
                        onClick={handleReset}
                        startIcon={<RestartAltIcon />}
                        sx={{ height: '40px' }}
                    >
                        Reset
                    </Button>
                </Grid>

                {/* Sekcja filtrowania po dacie odblokowania */}
                <Grid item xs={12}>
                    <Box
                        sx={{
                            mt: 0.5,
                            p: 1.5,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                            border: '1px solid #c4b5fd',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, minWidth: 'fit-content' }}>
                            <CalendarMonthIcon sx={{ fontSize: 16, color: '#7c3aed' }} />
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 700,
                                    color: '#5b21b6',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Data utworzenia
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', flex: 1 }}>
                            <TextField
                                label="Od"
                                name="dateFrom"
                                type="date"
                                value={filters.dateFrom}
                                onChange={handleChange}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    minWidth: 160,
                                    backgroundColor: '#ffffff',
                                    borderRadius: 1.5,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#c4b5fd' },
                                        '&:hover fieldset': { borderColor: '#7c3aed' },
                                        '&.Mui-focused fieldset': { borderColor: '#7c3aed' },
                                    },
                                }}
                            />

                            <Typography variant="caption" sx={{ color: '#7c3aed', fontWeight: 600 }}>—</Typography>

                            <TextField
                                label="Do"
                                name="dateTo"
                                type="date"
                                value={filters.dateTo}
                                onChange={handleChange}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    minWidth: 160,
                                    backgroundColor: '#ffffff',
                                    borderRadius: 1.5,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#c4b5fd' },
                                        '&:hover fieldset': { borderColor: '#7c3aed' },
                                        '&.Mui-focused fieldset': { borderColor: '#7c3aed' },
                                    },
                                }}
                            />

                            {(filters.dateFrom || filters.dateTo) && (
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => setFilters(prev => ({ ...prev, dateFrom: "", dateTo: "" }))}
                                    sx={{
                                        borderColor: '#c4b5fd',
                                        color: '#7c3aed',
                                        fontSize: '11px',
                                        height: '32px',
                                        '&:hover': {
                                            borderColor: '#7c3aed',
                                            backgroundColor: '#f5f3ff',
                                        },
                                    }}
                                >
                                    Wyczyść datę
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}