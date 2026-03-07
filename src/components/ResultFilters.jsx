// src/components/WynikiFilters.jsx
import React from "react";
import { Box, TextField, MenuItem, Grid, Paper } from "@mui/material";

export default function WynikiFilters({ filters, setFilters }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
                {/* Wyszukiwarka ogólna */}
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Szukaj (Nr, Nazwa, Indeks...)"
                        name="search"
                        value={filters.search}
                        onChange={handleChange}
                        size="small"
                    />
                </Grid>

                {/* Filtr Statusu */}
                <Grid item xs={12} md={3}>
                    <TextField
                        select
                        fullWidth
                        label="Status Próbki"
                        name="status"
                        value={filters.status}
                        onChange={handleChange}
                        size="small"
                    >
                        <MenuItem value="">Wszystkie</MenuItem>
                        <MenuItem value="ZGODNY">ZGODNY</MenuItem>
                        <MenuItem value="NIEZGODNY">NIEZGODNY</MenuItem>
                        <MenuItem value="OCZEKUJE">OCZEKUJE</MenuItem>
                    </TextField>
                </Grid>

                {/* Filtr Partii */}
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Filtruj po Partii"
                        name="batch"
                        value={filters.batch}
                        onChange={handleChange}
                        size="small"
                    />
                </Grid>
            </Grid>
        </Paper>
    );
}