// src/components/WynikiTable.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Skeleton, Alert
} from "@mui/material";
import { fetchWynikiProbek } from "../api/getSampleResult.js";
import { wynikiColumns } from "../config/resultColumns.js";

export default function WynikiTable({ filters }) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pobieranie danych (zostaje bez zmian)
    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchWynikiProbek();
            setRows(data);
        } catch (err) {
            console.error("Szczegóły błędu:", err);
            setError("Błąd API"); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    // 🔥 LOGIKA FILTROWANIA
    const filteredRows = useMemo(() => {
        return rows.filter((r) => {
            const searchText = filters.search.toLowerCase();

            // Szukanie w wielu polach naraz
            const matchesSearch =
                String(r.NrSample || "").toLowerCase().includes(searchText) ||
                String(r.ItemName || "").toLowerCase().includes(searchText) ||
                String(r.ItemCode || "").toLowerCase().includes(searchText);

            const matchesStatus = filters.status
                ? r.StatusSample === filters.status
                : true;

            const matchesBatch = filters.batch
                ? String(r.Batch || "").toLowerCase().includes(filters.batch.toLowerCase())
                : true;

            return matchesSearch && matchesStatus && matchesBatch;
        });
    }, [rows, filters]);

    return (
        <Box>
            {/* 🔥 Wykorzystanie zmiennej 'loading' */}
            {loading && (
                <Skeleton variant="rounded" height={300} sx={{ mb: 2 }} />
            )}

            {/* 🔥 Wykorzystanie zmiennej 'error' */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}
            {!loading && !error && (
            <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {wynikiColumns.filter(c => !c.hidden).map((col) => (
                                <TableCell key={col.id} style={{ minWidth: col.minWidth, background: '#f5f5f5', fontWeight: 'bold' }}>
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* 🔥 Renderujemy przefiltrowane wiersze */}
                        {filteredRows.map((row, idx) => (
                            <TableRow key={row.ID || idx} hover>
                                {wynikiColumns.filter(c => !c.hidden).map((col) => (
                                    <TableCell key={col.id}>
                                        {row[col.id] ?? "-"}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            )}
        </Box>
    );
}