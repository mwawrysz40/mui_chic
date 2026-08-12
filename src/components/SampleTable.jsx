// src/components/SampleTable.jsx
import React, { useState } from "react";
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
import { Tooltip, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import TableChartIcon from "@mui/icons-material/TableChart";
import Q2Modal from "./Q2Modal.jsx";
import ExcelExportModal from "./ExcelExportModal.jsx";

import { useSamples, useDeleteSample } from "../hooks/queries.js";
import { sampleColumns } from "../config/sampleColumns.js";
import { useServerTable } from "../hooks/useServerTable.js";
import StatusBadge from "./StatusBadge.jsx";
import { BADGE_COLUMNS_SAMPLE } from "../config/statusBadgeConfig.js";
import TablePaginator from "./TablePaginator.jsx";
import SortableHeaderCell from "./SortableHeaderCell.jsx";
import { buildStickySx } from "./stickySx.js";

const visibleColumns = sampleColumns.filter(col => !col.hidden);
const stickySx = buildStickySx(visibleColumns);

/** Mapa: klucz stanu filtrów strony → parametr API GetSample. */
const FILTER_PARAMS = {
    search: "search",
    owner: "owner",
    batch: "batch",
    createFrom: "dateFrom",
    createTo: "dateTo",
};

export default function SampleTable({ onEdit, filters }) {
    // Paginacja/filtr/sort po stronie bazy — wspólny stan w useServerTable.
    const { apiParams, sortCol, sortDir, handleSort, paginatorProps } =
        useServerTable(filters, FILTER_PARAMS);

    const { data, isLoading: loading, isError } = useSamples(apiParams);
    const rows = data?.rows ?? [];
    const total = data?.total ?? 0;

    const deleteMut = useDeleteSample();

    // Q2 Modal state
    const [q2Open, setQ2Open]               = useState(false);
    const [selectedSampleId, setSelectedSampleId] = useState(null);

    // Excel export modal state
    const [excelOpen, setExcelOpen] = useState(false);

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [rowToDelete, setRowToDelete]           = useState(null);
    const [deleteError, setDeleteError]           = useState(null);

    const handleDeleteClick = (row) => {
        setRowToDelete(row);
        setDeleteError(null);
        setDeleteDialogOpen(true);
    };

    const handleDeleteCancel = () => {
        if (deleteMut.isPending) return;
        setDeleteDialogOpen(false);
        setRowToDelete(null);
        setDeleteError(null);
    };

    const handleDeleteConfirm = async () => {
        if (!rowToDelete) return;
        setDeleteError(null);
        try {
            await deleteMut.mutateAsync(rowToDelete.ID);
            setDeleteDialogOpen(false);
            setRowToDelete(null);
        } catch (err) {
            setDeleteError(err?.message || "Nie udało się usunąć rekordu.");
        }
    };

    if (loading) {
        return (
            <Box sx={{ mt: 2 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={60} sx={{ mb: 1 }} />
                ))}
            </Box>
        );
    }

    if (isError) {
        return <Alert severity="error" sx={{ mt: 2 }}>Nie udało się pobrać danych z API.</Alert>;
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>

            {/* Pasek akcji nad tabelą */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    startIcon={<TableChartIcon />}
                    onClick={() => setExcelOpen(true)}
                >
                    Pobierz Excel
                </Button>
            </Box>

            {total === 0 ? (
                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Alert severity="info">Brak próbek spełniających kryteria filtrowania.</Alert>
                </Box>
            ) : (
                <Paper sx={{ display: "flex", flexDirection: "column", flexGrow: 1, overflow: "hidden" }}>
                    <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {visibleColumns.map((col, index) => (
                                        <SortableHeaderCell
                                            key={col.id}
                                            col={col}
                                            stickySx={stickySx.head[index]}
                                            sortCol={sortCol}
                                            sortDir={sortDir}
                                            onSort={handleSort}
                                        />
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.id} hover>
                                        {visibleColumns.map((col, index) => (
                                            <TableCell key={col.id} sx={stickySx.cell[index]}>
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
                                                    row[col.id] ?? "-"
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePaginator {...paginatorProps(total)} />
                </Paper>
            )}

            {/* ---- Excel Export Modal ---- */}
            <ExcelExportModal
                open={excelOpen}
                onClose={() => setExcelOpen(false)}
            />

            {/* ---- Q2 Modal ---- */}
            <Q2Modal
                open={q2Open}
                sampleId={selectedSampleId}
                onClose={() => setQ2Open(false)}
            />

            {/* ---- Delete Confirmation Dialog ---- */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="xs" fullWidth>
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
                        <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleDeleteCancel} disabled={deleteMut.isPending} variant="outlined">
                        Anuluj
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        disabled={deleteMut.isPending}
                        variant="contained"
                        color="error"
                        startIcon={deleteMut.isPending ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
                    >
                        {deleteMut.isPending ? "Usuwanie…" : "Usuń"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}