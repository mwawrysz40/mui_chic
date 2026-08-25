// src/pages/Banderole.jsx
import React, { useMemo, useState } from "react";
import {
    Alert, Box, Button, CircularProgress, Grid, MenuItem, Paper, Skeleton,
    Snackbar, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TextField, Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TableViewIcon from "@mui/icons-material/TableView";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useBanderole, useBanderolaData } from "../hooks/queries.js";
import { fetchBanderolaExcel, fetchBanderolaPdf } from "../api/banderoleService.js";
import { downloadBlob } from "../api/excelService.js";
import TablePaginator from "../components/TablePaginator.jsx";
import { usePagination } from "../hooks/usePagination.js";

// Kolumny DECIMAL przychodzą z HANA jako stringi, np. "16.000000".
const DECIMAL_STR_RE = /^-?\d+\.\d+$/;

function cellText(val) {
    if (val === null || val === undefined) return "-";
    if (typeof val === "number" && !Number.isInteger(val)) return val.toFixed(2);
    if (typeof val === "string" && DECIMAL_STR_RE.test(val)) {
        const n = Number(val);
        return Number.isInteger(n) ? String(n) : n.toFixed(2);
    }
    return String(val);
}

export default function Banderole() {
    const { data: meta, isLoading: metaLoading, isError: metaError } = useBanderole();

    const [selectedKey, setSelectedKey] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    // Parametry ostatniego kliknięcia "Pokaż dane" — dopiero one uruchamiają zapytanie.
    const [submitted, setSubmitted] = useState(null);
    const [snack, setSnack] = useState(null);
    const [exporting, setExporting] = useState(null); // "excel" | "pdf" | null

    const ewidencje = meta?.ewidencje ?? [];

    const filtersValid = Boolean(selectedKey && dateFrom && dateTo);

    const currentFilters = useMemo(() => ({ dateFrom, dateTo }), [dateFrom, dateTo]);

    const {
        data: rows = [],
        isFetching,
        isError: dataError,
    } = useBanderolaData(submitted?.key, submitted?.filters, Boolean(submitted));

    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    const { page, pageSize, pageRows, totalPages, setPage, setPageSize } = usePagination(rows, 25);

    const handleShow = () => setSubmitted({ key: selectedKey, filters: currentFilters });

    const handleExport = async (kind) => {
        setExporting(kind);
        try {
            const fetcher = kind === "excel" ? fetchBanderolaExcel : fetchBanderolaPdf;
            const blob = await fetcher(selectedKey, currentFilters);
            downloadBlob(blob, `${selectedKey}_${dateFrom}_${dateTo}.${kind === "excel" ? "xlsx" : "pdf"}`);
        } catch (err) {
            setSnack(err.message || `Nie udało się wygenerować pliku ${kind === "excel" ? "Excel" : "PDF"}.`);
        } finally {
            setExporting(null);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", px: 3, pt: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main", mb: 1.5 }}>
                Akcyza: Ewidencja banderol-ESL
            </Typography>

            <Paper sx={{ p: 2, mb: 2, border: "1px solid #e0e0e0", boxShadow: "none", flexShrink: 0 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: "#666", fontWeight: "bold" }}>
                    Wybór ewidencji i zakresu dat
                </Typography>

                {metaError && (
                    <Alert severity="error" sx={{ mb: 2 }}>Nie udało się pobrać listy ewidencji banderol.</Alert>
                )}

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={5}>
                        <TextField select fullWidth size="small" label="Ewidencja"
                                   value={selectedKey}
                                   onChange={(e) => { setSelectedKey(e.target.value); setSubmitted(null); }}
                                   disabled={metaLoading}>
                            {ewidencje.map((e) => (
                                <MenuItem key={e.key} value={e.key} sx={{ whiteSpace: "normal", maxWidth: 720 }}>
                                    {e.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <TextField fullWidth size="small" type="date" label="Od"
                                   value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                                   InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <TextField fullWidth size="small" type="date" label="Do"
                                   value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                                   InputLabelProps={{ shrink: true }} />
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                            <Button variant="contained" startIcon={<SearchIcon />}
                                    disabled={!filtersValid || isFetching}
                                    onClick={handleShow}>
                                Pokaż dane
                            </Button>
                            <Button variant="outlined" color="success"
                                    startIcon={exporting === "excel"
                                        ? <CircularProgress size={16} color="inherit" /> : <TableViewIcon />}
                                    disabled={!filtersValid || exporting !== null}
                                    onClick={() => handleExport("excel")}>
                                Excel
                            </Button>
                            <Button variant="outlined" color="error"
                                    startIcon={exporting === "pdf"
                                        ? <CircularProgress size={16} color="inherit" /> : <PictureAsPdfIcon />}
                                    disabled={!filtersValid || exporting !== null}
                                    onClick={() => handleExport("pdf")}>
                                PDF
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {isFetching ? (
                <Box>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} variant="rounded" height={44} sx={{ mb: 1 }} />
                    ))}
                </Box>
            ) : dataError ? (
                <Alert severity="error">Nie udało się pobrać danych ewidencji banderol.</Alert>
            ) : !submitted ? (
                <Alert severity="info">Wybierz ewidencję, podaj daty i kliknij „Pokaż dane”.</Alert>
            ) : rows.length === 0 ? (
                <Alert severity="info">Brak danych w wybranym okresie.</Alert>
            ) : (
                <Paper sx={{ display: "flex", flexDirection: "column", overflow: "hidden", mb: 1 }}>
                    <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    {columns.map((col) => (
                                        <TableCell key={col} sx={{
                                            fontWeight: 700,
                                            backgroundColor: "#faf9ff",
                                            whiteSpace: "normal",
                                            lineHeight: 1.3,
                                            minWidth: 110,
                                            verticalAlign: "bottom",
                                        }}>
                                            {col}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pageRows.map((row, idx) => (
                                    <TableRow key={idx} hover>
                                        {columns.map((col) => (
                                            <TableCell key={col} sx={{ whiteSpace: "nowrap" }}>
                                                {cellText(row[col])}
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
                        totalRows={rows.length}
                        totalPages={totalPages}
                        setPage={setPage}
                        setPageSize={setPageSize}
                    />
                </Paper>
            )}

            <Snackbar
                open={Boolean(snack)}
                autoHideDuration={6000}
                onClose={() => setSnack(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                {snack ? (
                    <Alert severity="error" variant="filled" onClose={() => setSnack(null)}>
                        {snack}
                    </Alert>
                ) : null}
            </Snackbar>
        </Box>
    );
}