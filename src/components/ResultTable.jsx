// src/components/ResultTable.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Tooltip, Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import { fetchWynikiProbek } from "../api/getSampleResult.js"
import { wynikiColumns } from "../config/resultColumns.js";
import WynikiFilters from "./ResultFilters.jsx";

export default function ResultTable({ onEdit, reloadTrigger, filters }) {
    const [rows, setRows] = useState([]);
    //const [showFilters, setShowFilters] = useState(true); // 1. Toggle filtrów
    //const [filters, setFilters] = useState({ search: "", status: "", batch: "" });
    const loadData = async () => {
        try {
            const data = await fetchWynikiProbek();
            setRows(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { loadData(); }, [reloadTrigger]);

    const filteredRows = useMemo(() => {
        return rows.filter(r => {
            // Dodajemy zabezpieczenie, jeśli filters byłoby chwilowo undefined
            const search = (filters?.search || "").toLowerCase();
            const batchFilter = (filters?.batch || "").toLowerCase();

            const matchesSearch =
                String(r.NrSample || "").toLowerCase().includes(search) ||
                String(r.ItemName || "").toLowerCase().includes(search);

            const matchesStatus = filters?.status ? r.StatusSample === filters.status : true;

            const matchesBatch = batchFilter ? String(r.Batch || "").toLowerCase().includes(batchFilter) : true;

            return matchesSearch && matchesStatus && matchesBatch;
        });
    }, [rows, filters]);
    // const loadData = async () => {
    //     try {
    //         const data = await fetchWynikiProbek();
    //         setRows(data);
    //     } catch (err) { console.error(err); }
    // };
    //
    // useEffect(() => { loadData(); }, [reloadTrigger]);

    // const filteredRows = useMemo(() => {
    //     return rows.filter(r => {
    //         const search = filters.search.toLowerCase();
    //         return (
    //             (String(r.NrSample || "").toLowerCase().includes(search) ||
    //                 String(r.ItemName || "").toLowerCase().includes(search)) &&
    //             (filters.status ? r.StatusSample === filters.status : true)
    //         );
    //     });
    // }, [rows, filters]);

    // Dodajemy kolumnę akcji do konfiguracji kolumn na potrzeby renderowania
    const allCols = [...wynikiColumns, { id: "actions", label: "Akcje", minWidth: 100, sticky: "right" }];

    return (
        <Box>
            {/*<Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>*/}
            {/*    <Button*/}
            {/*        startIcon={showFilters ? <FilterListOffIcon /> : <FilterListIcon />}*/}
            {/*        onClick={() => setShowFilters(!showFilters)}*/}
            {/*    >*/}
            {/*        {showFilters ? "Ukryj filtry" : "Pokaż filtry"}*/}
            {/*    </Button>*/}
            {/*</Box>*/}

            {/*{showFilters && <WynikiFilters filters={filters} setFilters={setFilters} />}*/}

            <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {allCols.filter(c => !c.hidden).map((col, index) => (
                                <TableCell
                                    key={col.id}
                                    style={{
                                        minWidth: col.minWidth,
                                        // 2. Zamrażanie pierwszej (index 0) lub oznaczonej jako sticky
                                        position: (index === 0 || col.sticky) ? "sticky" : "static",
                                        left: (index === 0 || col.sticky === "left") ? 0 : undefined,
                                        right: col.sticky === "right" ? 0 : undefined,
                                        zIndex: (index === 0 || col.sticky) ? 3 : 1,
                                        background: "#fff"
                                    }}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRows.map((row) => (
                            <TableRow key={row.ID} hover>
                                {allCols.filter(c => !c.hidden).map((col, index) => (
                                    <TableCell
                                        key={col.id}
                                        style={{
                                            position: (index === 0 || col.sticky) ? "sticky" : "static",
                                            left: (index === 0 || col.sticky === "left") ? 0 : undefined,
                                            right: col.sticky === "right" ? 0 : undefined,
                                            background: "#fff",
                                            zIndex: (index === 0 || col.sticky) ? 2 : 1
                                        }}
                                    >
                                        {col.id === "actions" ? (
                                            <Tooltip title="Edytuj wynik">
                                                <IconButton onClick={() => onEdit(row)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (row[col.id] ?? "-")}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}