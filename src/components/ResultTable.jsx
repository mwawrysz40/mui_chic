// src/components/ResultTable.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Tooltip, Alert, Skeleton, Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { fetchWynikiProbek } from "../api/getSampleResult.js";
import { wynikiColumns } from "../config/resultColumns.js";

const allCols = [
    ...wynikiColumns.filter(c => !c.hidden),
    { id: "actions", label: "Akcje", minWidth: 100, sticky: "right" }
];

// Używamy sx zamiast style — inline style ma wyższy priorytet niż klasy
// CSS generowane przez MUI i blokowałby overrides z theme.js.
// bgcolor ustawiamy TYLKO dla sticky kolumn (żeby wiersze nie przeświecały
// podczas scrollowania). Zwykłe kolumny dziedziczą tło z motywu:
// nagłówki dostają szare background.default z MuiTableCell head override.
function getStickySx(col, index, isHeader) {
    const isSticky = index === 0 || Boolean(col.sticky);
    const sx = {
        minWidth: col.minWidth,
        position: isSticky ? "sticky" : "static",
        left: (index === 0 || col.sticky === "left") ? 0 : undefined,
        right: col.sticky === "right" ? 0 : undefined,
        zIndex: isSticky ? (isHeader ? 3 : 2) : 1,
    };
    if (isSticky) {
        sx.bgcolor = isHeader ? "background.default" : "background.paper";
    }
    return sx;
}

export default function ResultTable({ onEdit, reloadTrigger, filters }) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchWynikiProbek();
            setRows(data);
        } catch (err) {
            console.error("ResultTable fetch error:", err);
            setError("Nie udało się pobrać wyników próbek. Sprawdź połączenie z API.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [reloadTrigger, loadData]);

    const filteredRows = useMemo(() => {
        return rows.filter(r => {
            const search = (filters?.search || "").toLowerCase();
            const batchFilter = (filters?.batch || "").toLowerCase();

            const matchesSearch =
                String(r.NrSample || "").toLowerCase().includes(search) ||
                String(r.ItemName || "").toLowerCase().includes(search);

            const matchesStatus = filters?.status
                ? r.StatusSample === filters.status
                : true;

            const matchesBatch = batchFilter
                ? String(r.Batch || "").toLowerCase().includes(batchFilter)
                : true;

            return matchesSearch && matchesStatus && matchesBatch;
        });
    }, [rows, filters]);

    if (loading) {
        return (
            <Box sx={{ mt: 2 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={52} sx={{ mb: 1 }} />
                ))}
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error}
            </Alert>
        );
    }

    if (filteredRows.length === 0) {
        return (
            <Box sx={{ mt: 4, textAlign: "center" }}>
                <Alert severity="info">Brak próbek spełniających kryteria filtrowania.</Alert>
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ mt: 2, maxHeight: "70vh" }}>
            <Table stickyHeader>

                <TableHead>
                    <TableRow>
                        {allCols.map((col, index) => (
                            <TableCell
                                key={col.id}
                                sx={getStickySx(col, index, true)}
                            >
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {filteredRows.map((row) => (
                        <TableRow key={row.ID} hover>
                            {allCols.map((col, index) => (
                                <TableCell
                                    key={col.id}
                                    sx={getStickySx(col, index, false)}
                                >
                                    {col.id === "actions" ? (
                                        <Tooltip title="Edytuj wynik">
                                            <IconButton
                                                size="small"
                                                onClick={() => onEdit(row)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        row[col.id] ?? "-"
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </TableContainer>
    );
}