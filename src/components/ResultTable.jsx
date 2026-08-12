// src/components/ResultTable.jsx
import React, { useState } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Tooltip, Alert, Skeleton, Snackbar
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useSampleResults, useUnlockSample } from "../hooks/queries.js";
import { wynikiColumns } from "../config/resultColumns.js";
import { useServerTable } from "../hooks/useServerTable.js";
import StatusBadge from "./StatusBadge.jsx";
import { BADGE_COLUMNS_RESULT } from "../config/statusBadgeConfig.js";
import TablePaginator from "./TablePaginator.jsx";
import SortableHeaderCell from "./SortableHeaderCell.jsx";
import { buildStickySx } from "./stickySx.js";
import { useAuth } from "../auth/AuthProvider";

const STATUS_ZABLOKOWANY = "ZABLOKOWANY";

const allCols = [
    ...wynikiColumns.filter(c => !c.hidden),
    { id: "actions", label: "Akcje", minWidth: 150, sticky: "right", sortable: false }
];
const stickySx = buildStickySx(allCols);

/** Mapa: klucz stanu filtrów strony → parametr API GetSampleResult. */
const FILTER_PARAMS = {
    search: "search",
    status: "status",
    batch: "batch",
    dateFrom: "dateFrom",
    dateTo: "dateTo",
};

export default function ResultTable({ onEdit, filters }) {
    // Paginacja/filtr/sort po stronie bazy — wspólny stan w useServerTable.
    const { apiParams, sortCol, sortDir, handleSort, paginatorProps } =
        useServerTable(filters, FILTER_PARAMS);

    const { data, isLoading: loading, isError } = useSampleResults(apiParams);
    const rows = data?.rows ?? [];
    const total = data?.total ?? 0;

    const unlockMut = useUnlockSample();
    const { user } = useAuth();

    const [unlocking, setUnlocking]               = useState(null);
    const [unlockError, setUnlockError]           = useState(null);
    const [unlockSuccess, setUnlockSuccess]       = useState(false);
    const [unlockedIds, setUnlockedIds] = useState(new Set());

    const handleUnlock = async (row) => {
        setUnlocking(row.ID);
        setUnlockError(null);
        try {
            const person = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
            await unlockMut.mutateAsync({ batch: row.Batch, person });
            setUnlockedIds(prev => new Set(prev).add(row.ID));
            setUnlockSuccess(true);
        } catch (err) {
            setUnlockError(err.message || "Nie udało się odblokować próbki.");
        } finally {
            setUnlocking(null);
        }
    };

    if (loading) {
        return (
            <Box sx={{ mt: 2 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={52} sx={{ mb: 1 }} />
                ))}
            </Box>
        );
    }

    if (isError) {
        return <Alert severity="error" sx={{ mt: 2 }}>Nie udało się pobrać wyników próbek. Sprawdź połączenie z API.</Alert>;
    }

    if (total === 0) {
        return (
            <Box sx={{ mt: 4, textAlign: "center" }}>
                <Alert severity="info">Brak wyników spełniających kryteria filtrowania.</Alert>
            </Box>
        );
    }

    return (
        <>
            <Paper sx={{ mt: 2, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
                    <Table stickyHeader>

                        <TableHead>
                            <TableRow>
                                {allCols.map((col, index) => (
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
                                <TableRow key={row.ID} hover>
                                    {allCols.map((col, index) => (
                                        <TableCell key={col.id} sx={stickySx.cell[index]}>
                                            {col.id === "actions" ? (
                                                <>
                                                    <Tooltip title="Edytuj wynik">
                                                        <IconButton size="small" onClick={() => onEdit(row)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title={
                                                        row.StatusSample === STATUS_ZABLOKOWANY
                                                            ? "Próbka jest zablokowana"
                                                            : unlockedIds.has(row.ID)
                                                                ? "Próbka odblokowana"
                                                                : "Odblokuj próbkę"
                                                    }>
                                                        <span>
                                                            <IconButton
                                                                size="small"
                                                                disabled={row.StatusSample === STATUS_ZABLOKOWANY || unlocking === row.ID || unlockedIds.has(row.ID)}
                                                                onClick={() => handleUnlock(row)}
                                                                color="warning"
                                                            >
                                                                <LockOpenIcon fontSize="small" />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </>
                                            ) : BADGE_COLUMNS_RESULT.has(col.id) ? (
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