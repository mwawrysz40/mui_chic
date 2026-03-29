// src/components/SampleTable.jsx
import React, { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import InfoIcon from "@mui/icons-material/Info";
import { Tooltip } from "@mui/material";
import Q2Modal from "./Q2Modal.jsx";

import { fetchSamples } from "../api/sampleService.js";
import { sampleColumns } from "../config/sampleColumns.js";
import { sampleFilterConfig } from "../config/sampleFilterConfig.js";
import { useFilteredRows } from "../hooks/useFilteredRows.js";
import StatusBadge from "./StatusBadge.jsx";
import { BADGE_COLUMNS_SAMPLE } from "../config/statusBadgeConfig.js";

function getStickySx(col, isHeader) {
    const isSticky = Boolean(col.sticky);
    return {
        minWidth: col.minWidth,
        position: isSticky ? "sticky" : "static",
        left: col.sticky === "left" ? 0 : undefined,
        right: col.sticky === "right" ? 0 : undefined,
        zIndex: isSticky ? (isHeader ? 3 : 2) : 1,
        ...(isSticky && {
            backgroundColor: isHeader ? "#faf9ff" : "#ffffff",
        }),
    };
}

const visibleColumns = sampleColumns.filter(col => !col.hidden);

export default function SampleTable({ onEdit, filters, reloadTrigger }) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [q2Open, setQ2Open] = useState(false);
    const [selectedSampleId, setSelectedSampleId] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchSamples();
            setRows(data);
        } catch (err) {
            setError("Nie udało się pobrać danych z API.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [reloadTrigger, loadData]);

    // Filtrowanie na podstawie konfiguracji z sampleFilterConfig.js
    const filteredRows = useFilteredRows(rows, filters, sampleFilterConfig);

    if (loading) {
        return (
            <Box sx={{ mt: 2 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={60} sx={{ mb: 1 }} />
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
                <Alert severity="info">Brak próbek spełniających kryteria filtrowania.</Alert>
            </Box>
        );
    }

    return (
        <Box>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table stickyHeader>

                    <TableHead>
                        <TableRow>
                            {visibleColumns.map((col) => (
                                <TableCell key={col.id} sx={getStickySx(col, true)}>
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredRows.map((row) => (
                            <TableRow key={row.id} hover>
                                {visibleColumns.map((col) => (
                                    <TableCell key={col.id} sx={getStickySx(col, false)}>
                                        {col.id === "actions" ? (
                                            <>
                                                <Tooltip title="Edytuj rekord">
                                                    <IconButton size="small" onClick={() => onEdit(row)}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Q2 – pomiary">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedSampleId(row.ID);
                                                            setQ2Open(true);
                                                        }}
                                                    >
                                                        <InfoIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        ) : BADGE_COLUMNS_SAMPLE.has(col.id) ? (
                                            <StatusBadge value={row[col.id]} />
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

            <Q2Modal
                open={q2Open}
                sampleId={selectedSampleId}
                onClose={() => setQ2Open(false)}
            />
        </Box>
    );
}