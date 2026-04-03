// src/components/WynikiFilters.jsx
import React from "react";
import { Box, TextField, MenuItem, Grid, Paper, Button } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt"; // 🔥 Fajna ikona do resetu

export default function WynikiFilters({ filters, setFilters }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // 🔥 Funkcja czyszcząca
    const handleReset = () => {
        setFilters({
            search: "",
            status: "",
            batch: ""
        });
    };

    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Szukaj..." name="search" value={filters.search} onChange={handleChange} size="small" />
                </Grid>

                <Grid item xs={12} md={3}>
                    <TextField select fullWidth label="Status" name="status" value={filters.status} onChange={handleChange} size="small">
                        <MenuItem value="">Wszystkie</MenuItem>
                        <MenuItem value="ZWOLNIONY">ZWOLNIONY</MenuItem>
                        <MenuItem value="ZABLOKOWANY">ZABLOKOWANY</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12} md={3}>
                    <TextField fullWidth label="Partia" name="batch" value={filters.batch} onChange={handleChange} size="small" />
                </Grid>

                {/* 🔥 PRZYCISK RESETU */}
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
            </Grid>
        </Paper>
    );
}