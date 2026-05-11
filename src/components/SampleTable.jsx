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
import DeleteIcon from "@mui/icons-material/Delete";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import InfoIcon from "@mui/icons-material/Info";
import { Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Q2Modal from "./Q2Modal.jsx";

import { fetchSamples } from "../api/sampleService.js";
import { deleteSample } from "../api/deleteSampleService.js";
import { sampleColumns } from "../config/sampleColumns.js";
import { sampleFilterConfig } from "../config/sampleFilterConfig.js";
import { useFilteredRows } from "../hooks/useFilteredRows.js";
import { usePagination } from "../hooks/usePagination.js";
import { useSorting } from "../hooks/useSorting.js";
import StatusBadge from "./StatusBadge.jsx";
import { BADGE_COLUMNS_SAMPLE } from "../config/statusBadgeConfig.js";
import TablePaginator from "./TablePaginator.jsx";
import SortableHeaderCell from "./SortableHeaderCell.jsx";

function getStickySx(col, index, isHeader) {
    const isHorizontalSticky = index === 0 || Boolean(col.sticky);

    return {
        minWidth:        col.minWidth,
        position:        isHorizontalSticky ? "sticky" : (isHeader ? "sticky" : "static"),
        left:            (index === 0 || col.sticky === "left") ? 0 : undefined,
        right:           col.sticky === "right" ? 0 : undefined,
        zIndex:          isHeader
            ? (isHorizontalSticky ? 4 : 3)
            : (isHorizontalSticky ? 2 : 1),
        whiteSpace:      (isHeader && col.wrap) ? "normal" : "nowrap",
        lineHeight:      (isHeader && col.wrap) ? 1.3 : undefined,
        verticalAlign:   isHeader ? "bottom" : "middle",
        backgroundColor: isHeader ? "#faf9ff" : (isHorizontalSticky ? "#ffffff" : undefined),
    };
}

/**
 * @typedef {{ ID: string|number, nazwa?: string, [key: string]: unknown }} SampleRow
 */

const visibleColumns = sampleColumns.filter(col => !col.hidden);

export default function SampleTable({ onEdit, filters, reloadTrigger }) {
    /** @type {[SampleRow[], React.Dispatch<React.SetStateAction<SampleRow[]>>]} */
    const [rows, setRows]       = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(/** @type {string|null} */ (null));

    // Q2 Modal state
    const [q2Open, setQ2Open]   = useState(false);
    const [selectedSampleId, setSelectedSampleId] = useState(/** @type {string|number|null} */ (null));

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [rowToDelete, setRowToDelete]           = useState(/** @type {SampleRow|null} */ (null));
    const [deleteLoading, setDeleteLoading]       = useState(false);
    const [deleteError, setDeleteError]           = useState(/** @type {string|null} */ (null));

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchSamples();
            setRows(data);
        } catch (_err) {
            setError("Nie udało się pobrać danych z API.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadData();
    }, [reloadTrigger, loadData]);

    // ---- Delete handlers ----
    const handleDeleteClick = (row) => {
        setRowToDelete(row);
        setDeleteError(null);
        setDeleteDialogOpen(true);
    };

    const handleDeleteCancel = () => {
        if (deleteLoading) return; // blokuj zamknięcie w trakcie usuwania
        setDeleteDialogOpen(false);
        setRowToDelete(null);
        setDeleteError(null);
    };

    const handleDeleteConfirm = async () => {
        if (!rowToDelete) return;
        setDeleteLoading(true);
        setDeleteError(null);
        try {
            await deleteSample(rowToDelete.ID);
            setRows(prev => prev.filter(r => r.ID !== rowToDelete.ID));
            setDeleteDialogOpen(false);
            setRowToDelete(null);
        } catch (err) {
            setDeleteError(err?.message || "Nie udało się usunąć rekordu.");
        } finally {
            setDeleteLoading(false);
        }
    };

    // 1. Filtrowanie
    const filteredRows = useFilteredRows(rows, filters, sampleFilterConfig);

    // 2. Sortowanie (na przefiltrowanych danych)
    const { sortedRows, sortCol, sortDir, handleSort } = useSorting(filteredRows);

    // 3. Paginacja (na posortowanych danych)
    const { page, pageSize, pageRows, totalPages, setPage, setPageSize } =
        usePagination(sortedRows, 25);

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
            <Paper sx={{ mt: 2, display: "flex", flexDirection: "column", flexGrow: 1, overflow: "hidden" }}>

                <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
                    <Table stickyHeader>

                        <TableHead>
                            <TableRow>
                                {visibleColumns.map((col, index) => (
                                    <SortableHeaderCell
                                        key={col.id}
                                        col={col}
                                        stickySx={getStickySx(col, index, true)}
                                        sortCol={sortCol}
                                        sortDir={sortDir}
                                        onSort={handleSort}
                                    />
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {pageRows.map((row) => (
                                <TableRow key={row.id} hover>
                                    {visibleColumns.map((col, index) => (
                                        <TableCell key={col.id} sx={getStickySx(col, index, false)}>
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
                                                    <Tooltip title="Usuń rekord">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeleteClick(row)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            ) : BADGE_COLUMNS_SAMPLE.has(col.id) ? (
                                                <StatusBadge value={row[col.id]} />
                                            ) : (
                                                /** @type {React.ReactNode} */ (row[col.id]) ?? "-"
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>

                <TablePaginator
                    page={page}
                    pageSize={pageSize}
                    totalRows={sortedRows.length}
                    totalPages={totalPages}
                    setPage={setPage}
                    setPageSize={setPageSize}
                />

            </Paper>

            {/* ---- Q2 Modal ---- */}
            <Q2Modal
                open={q2Open}
                sampleId={selectedSampleId}
                onClose={() => setQ2Open(false)}
            />

            {/* ---- Delete Confirmation Dialog ---- */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ color: "error.main" }}>
                    Potwierdzenie usunięcia
                </DialogTitle>
                <DialogContent>
                    <DialogContentText component="div">
                        Czy na pewno chcesz usunąć próbkę{" "}
                        <strong>{String(rowToDelete?.sampleNumber ?? "")}</strong>?
                        {rowToDelete?.nazwa && (
                            <> &nbsp;(<em>{String(rowToDelete.nazwa)}</em>)</>
                        )}
                        <br />
                        Tej operacji nie można cofnąć.
                    </DialogContentText>

                    {deleteError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {deleteError}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleDeleteCancel}
                        disabled={deleteLoading}
                        variant="outlined"
                    >
                        Anuluj
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        disabled={deleteLoading}
                        variant="contained"
                        color="error"
                        startIcon={deleteLoading ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
                    >
                        {deleteLoading ? "Usuwanie…" : "Usuń"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}