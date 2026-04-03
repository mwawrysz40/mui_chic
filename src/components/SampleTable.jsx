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

function getStickySx(col, index, isHeader) {
    const isHorizontalSticky = index === 0 || Boolean(col.sticky);

    return {
        minWidth:   col.minWidth,
        // MUI dba o przyklejanie nagłówków w pionie, ale dla kolumn
        // przyklejonych w poziomie musimy to wymusić
        position:   isHorizontalSticky ? "sticky" : (isHeader ? "sticky" : "static"),
        left:       (index === 0 || col.sticky === "left") ? 0 : undefined,
        right:      col.sticky === "right" ? 0 : undefined,

        // Z-index zarządzany warstwami:
        // 4 - Nagłówek przyklejony w poziomie (najwyżej)
        // 3 - Zwykły nagłówek
        // 2 - Komórka danych przyklejona poziomo
        // 1 - Zwykła komórka danych
        zIndex:     isHeader
            ? (isHorizontalSticky ? 4 : 3)
            : (isHorizontalSticky ? 2 : 1),

        whiteSpace: (isHeader && col.wrap) ? "normal" : "nowrap",
        lineHeight: (isHeader && col.wrap) ? 1.3 : undefined,
        verticalAlign: isHeader ? "bottom" : "middle",

        backgroundColor: isHeader ? "#faf9ff" : (isHorizontalSticky ? "#ffffff" : undefined),
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
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <TableContainer component={Paper} sx={{ mt: 2, flexGrow: 1, overflow: "auto" }}>
                <Table stickyHeader>

                    <TableHead>
                        <TableRow>
                            {visibleColumns.map((col,index) => (
                                <TableCell key={col.id} sx={getStickySx(col,index, true)}>
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredRows.map((row) => (
                            <TableRow key={row.id} hover>
                                {visibleColumns.map((col,index) => (
                                    <TableCell key={col.id} sx={getStickySx(col, index,false)}>
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