// src/components/SampleTable.jsx
import React, { useEffect, useMemo, useState } from "react";
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
import Q2Modal from "../components/Q2Modal.jsx";
import InfoIcon from "@mui/icons-material/Info"; // przykładowa ikonka dla Q2

import { fetchSamples } from "../api/sampleService.js";
import { sampleColumns } from "../config/sampleColumns.js";
import {Tooltip} from "@mui/material";

export default function SampleTable({ onEdit, filters, reloadTrigger }) {

    // console.log("SampleTable PROPS:", { onEdit, filters, reloadTrigger });
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [q2Open, setQ2Open] = useState(false);
    const [selectedSampleId, setSelectedSampleId] = useState(null);

    // ------------------------------
    // 🔥 Główna funkcja pobierania danych
    // ------------------------------
    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchSamples();
            setRows(data);
        } catch (err) {
            setError("❌ Nie udało się pobrać danych z API.");
        } finally {
            setLoading(false);
        }
    };

    // 🔥 Pierwsze ładowanie
    useEffect(() => {
        loadData();
    }, []);

    // 🔥 Reload po zapisaniu rekordu
    useEffect(() => {
        // console.log("➡️ EFFECT FIRED — reload triggered:", reloadTrigger);
            loadData();
    }, [reloadTrigger]);

    // ------------------------------
    // 🔥 FILTROWANIE
    // ------------------------------
    const filteredRows = useMemo(() => {
        return rows.filter((r) => {
            const text = filters.search.toLowerCase();

            const matchesSearch = Object.values(r).some((v) =>
                String(v).toLowerCase().includes(text)
            );

            const matchesStatus =
                filters.status ? r.typeResarch === filters.status : true;

            const matchesOwner =
                filters.owner ? r.person === filters.owner : true;

            const matchesType =
                filters.type ? r.itemCode === filters.type : true;

            const matchesCreate =
                filters.create ? r.createAt === filters.create : true;

            return (
                matchesSearch &&
                matchesCreate &&
                matchesStatus &&
                matchesOwner &&
                matchesType

            );
        });
    }, [rows, filters]);

    return (
        <Box>

            {/* LOADING */}
            {loading && (
                <>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            variant="rounded"
                            height={60}
                            sx={{ mb: 1 }}
                        />
                    ))}
                </>
            )}

            {/* ERROR */}
            {error && <Alert severity="error">{error}</Alert>}

            {/* TABELA */}
            {!loading && !error && (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table stickyHeader>

                        <TableHead>
                            <TableRow>
                                {sampleColumns.map((col) => (
                                    <TableCell
                                        key={col.id}
                                        style={{
                                            minWidth: col.minWidth,
                                            position: col.sticky
                                                ? "sticky"
                                                : "static",
                                            left:
                                                col.sticky === "left"
                                                    ? 0
                                                    : undefined,
                                            right:
                                                col.sticky === "right"
                                                    ? 0
                                                    : undefined,
                                            background: col.sticky
                                                ? "#fff"
                                                : undefined,
                                            zIndex: col.sticky ? 3 : 1
                                        }}
                                    >
                                        {col.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredRows.map((row) => (
                                <TableRow key={row.id} hover>
                                    {sampleColumns.map((col) => (
                                        <TableCell
                                            key={col.id}
                                            style={{
                                                position: col.sticky
                                                    ? "sticky"
                                                    : "static",
                                                left:
                                                    col.sticky === "left"
                                                        ? 0
                                                        : undefined,
                                                right:
                                                    col.sticky === "right"
                                                        ? 0
                                                        : undefined,
                                                background: col.sticky
                                                    ? "#fff"
                                                    : undefined,
                                                zIndex: col.sticky ? 2 : 1
                                            }}
                                        >
                                            {col.id === "actions" ? (
                                                <>
                                                    {/* ✏ Edycja rekordu */}
                                                    <Tooltip title="Edytuj rekord">
                                                        <IconButton onClick={() => onEdit(row)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>

                                                    {/* 🟦 Nowy przycisk Q2 */}
                                                    <Tooltip title="Q2 – pomiary">
                                                        <IconButton
                                                            onClick={() => {
                                                                setSelectedSampleId(row.ID); // używamy ID rekordu
                                                                setQ2Open(true);
                                                            }}
                                                        >
                                                            <InfoIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            ) : (
                                                row[col.id]
                                            )}

                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>
            )}
            <Q2Modal
                open={q2Open}
                sampleId={selectedSampleId}
                onClose={() => setQ2Open(false)}
            />
        </Box>
    );
}
