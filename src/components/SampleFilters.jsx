// src/components/SampleFilters.jsx
import React, { useMemo } from "react";
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
            status: "",
            owner: "",
            type: ""
        });
    };
    // src/components/ResultTable.jsx (fragment logiki)

    // const filteredRows = useMemo(() => {
    //     // Jeśli nie ma danych, zwróć pustą tablicę
    //     if (!rows) return [];
    //
    //     return rows.filter((r) => {
    //         // 1. Logika wyszukiwania tekstowego (Search)
    //         const searchText = (filters.search || "").toLowerCase();
    //
    //         // Sprawdzamy czy tekst pasuje do któregokolwiek z kluczowych pól
    //         // Upewnij się, że nazwy pól (NrSample, ItemName) są identyczne z tymi z bazy/API
    //         const matchesSearch = searchText === "" || [
    //             r.NrSample,
    //             r.ItemName,
    //             r.ItemCode,
    //             r.Batch
    //         ].some(field => String(field || "").toLowerCase().includes(searchText));
    //
    //         // 2. Logika Statusu
    //         // Ważne: Sprawdź czy w bazie status to "ZGODNY" czy np. ID statusu
    //         const matchesStatus = !filters.status || r.StatusSample === filters.status;
    //
    //         // 3. Logika Partii (Batch)
    //         const matchesBatch = !filters.batch ||
    //             String(r.Batch || "").toLowerCase().includes(filters.batch.toLowerCase());
    //
    //         // Wszystkie warunki muszą być spełnione
    //         return matchesSearch && matchesStatus && matchesBatch;
    //     });
    // }, [rows, filters]);

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
                <Grid item xs={12} md={2}>
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
                        <MenuItem value="W TRAKCIE">W TRAKCIE</MenuItem>
                        <MenuItem value="ZAKOŃCZONE">ZAKOŃCZONE</MenuItem>
                        <MenuItem value="OCZEKUJE">OCZEKUJE</MenuItem>
                    </TextField>
                </Grid>

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

                {/* Filtr Typu (ItemCode) */}
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Kod Przedmiotu"
                        name="type"
                        value={filters.type}
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
                        sx={{
                            height: '40px',
                            backgroundColor: '#f5f5f5',
                            '&:hover': { backgroundColor: '#e0e0e0' }
                        }}
                    >
                        Reset
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}