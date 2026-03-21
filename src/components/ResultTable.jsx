// src/components/ResultTable.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Tooltip, Alert, Skeleton, Snackbar
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { fetchWynikiProbek } from "../api/getSampleResult.js";
import { unlockResultSample } from "../api/updateService.js";
import { wynikiColumns } from "../config/resultColumns.js";
import { resultFilterConfig } from "../config/resultFilterConfig.js";
import { useFilteredRows } from "../hooks/useFilteredRows.js";

const STATUS_ZABLOKOWANY = "ZABLOKOWANY";

const allCols = [
    ...wynikiColumns.filter(c => !c.hidden),
    { id: "actions", label: "Akcje", minWidth: 150, sticky: "right" }
];

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
    const [unlocking, setUnlocking] = useState(null); // ID wiersza który jest właśnie odblokowywany
    const [unlockError, setUnlockError] = useState(null);
    const [unlockSuccess, setUnlockSuccess] = useState(false);

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

    const handleUnlock = async (row) => {
        setUnlocking(row.ID);
        setUnlockError(null);
        try {
            await unlockResultSample(row.Batch);
            setUnlockSuccess(true);
            // Odśwież dane żeby status zaktualizował się w tabeli
            await loadData();
        } catch (err) {
            setUnlockError(err.message || "Nie udało się odblokować próbki.");
        } finally {
            setUnlocking(null);
        }
    };

    const filteredRows = useFilteredRows(rows, filters, resultFilterConfig);

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
        return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }

    if (filteredRows.length === 0) {
        return (
            <Box sx={{ mt: 4, textAlign: "center" }}>
                <Alert severity="info">Brak wyników spełniających kryteria filtrowania.</Alert>
            </Box>
        );
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ mt: 2, maxHeight: "70vh" }}>
                <Table stickyHeader>

                    <TableHead>
                        <TableRow>
                            {allCols.map((col, index) => (
                                <TableCell key={col.id} sx={getStickySx(col, index, true)}>
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredRows.map((row) => (
                            <TableRow key={row.ID} hover>
                                {allCols.map((col, index) => (
                                    <TableCell key={col.id} sx={getStickySx(col, index, false)}>
                                        {col.id === "actions" ? (
                                            <>
                                                {/* Przycisk Edytuj */}
                                                <Tooltip title="Edytuj wynik">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onEdit(row)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                {/* Przycisk Odblokuj — aktywny tylko gdy Status = ZABLOKOWANY */}
                                                <Tooltip title={
                                                    row.StatusSample === STATUS_ZABLOKOWANY
                                                        ? "Próbka nie jest zablokowana"
                                                        : "Odblokuj próbkę"
                                                }>
                                                    {/* span potrzebny żeby Tooltip działał na disabled IconButton */}
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            disabled={row.StatusSample === STATUS_ZABLOKOWANY || unlocking === row.ID}
                                                            onClick={() => handleUnlock(row)}
                                                            color="warning"
                                                        >
                                                            <LockOpenIcon fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </>
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

            {/* Błąd odblokowania */}
            <Snackbar
                open={Boolean(unlockError)}
                autoHideDuration={5000}
                onClose={() => setUnlockError(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="error" variant="filled" onClose={() => setUnlockError(null)}>
                    {unlockError}
                </Alert>
            </Snackbar>

            {/* Sukces odblokowania */}
            <Snackbar
                open={unlockSuccess}
                autoHideDuration={3000}
                onClose={() => setUnlockSuccess(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="success" variant="filled">
                    Próbka została odblokowana.
                </Alert>
            </Snackbar>
        </>
    );
}