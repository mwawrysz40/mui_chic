// src/components/SampleFilters.jsx
import React from "react";
import {
    Box,
    TextField,
    MenuItem,
    Grid,
    Paper,
    Button,
    Typography
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export default function SampleFilters({ filters, setFilters }) {

    // Funkcja obsługująca zmianę w polach tekstowych i selectach
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Funkcja czyszcząca wszystkie filtry do stanu początkowego
    const handleReset = () => {
        setFilters({
            search: "",
            // status: "",
            owner: "",
            batch: "",
            create:""
        });
    };


    return (
        <Paper sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#666', fontWeight: 'bold' }}>
                Filtrowanie listy
            </Typography>

            <Grid container spacing={2} alignItems="center">
                {/* Wyszukiwarka ogólna */}
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Szukaj (tekst)"
                        name="search"
                        value={filters.search}
                        onChange={handleChange}
                        size="small"
                        placeholder="Np. nazwa, nr..."
                    />
                </Grid>

                {/* Filtr Statusu */}
                {/*<Grid item xs={12} md={2}>*/}
                {/*    <TextField*/}
                {/*        select*/}
                {/*        fullWidth*/}
                {/*        label="Status"*/}
                {/*        name="status"*/}
                {/*        value={filters.status}*/}
                {/*        onChange={handleChange}*/}
                {/*        size="small"*/}
                {/*    >*/}
                {/*        <MenuItem value="">Wszystkie</MenuItem>*/}
                {/*        <MenuItem value="W TRAKCIE">W TRAKCIE</MenuItem>*/}
                {/*        <MenuItem value="ZAKOŃCZONE">ZAKOŃCZONE</MenuItem>*/}
                {/*        <MenuItem value="OCZEKUJE">OCZEKUJE</MenuItem>*/}
                {/*    </TextField>*/}
                {/*</Grid>*/}

                {/* Filtr Osoby (Owner) */}
                <Grid item xs={12} md={2}>
                    <TextField
                        fullWidth
                        label="Osoba"
                        name="owner"
                        value={filters.owner}
                        onChange={handleChange}
                        size="small"
                    />
                </Grid>

                {/* Filtr Typu (Partia) */}
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
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Data utworzenia"
                        name="create"
                        value={filters.create}
                        onChange={handleChange}
                        size="small"
                    />
                </Grid>

                {/* Przycisk Resetu */}
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