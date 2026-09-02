// src/pages/Ewidencje.jsx
import React, { useMemo, useState } from "react";
import {
    Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent,
    DialogTitle, Grid, IconButton, MenuItem, Paper, Skeleton,
    Snackbar, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TextField, Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TableViewIcon from "@mui/icons-material/TableView";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { useEwidencje, useEwidencjaData } from "../hooks/queries.js";
import { fetchEwidencjaExcel, fetchEwidencjaPdf } from "../api/ewidencjeService.js";
import { downloadBlob } from "../api/excelService.js";
import TablePaginator from "../components/TablePaginator.jsx";
import { usePagination } from "../hooks/usePagination.js";

// Kolumny DECIMAL przychodzą z HANA jako stringi, np. "16.000000".
const DECIMAL_STR_RE = /^-?\d+\.\d+$/;

function cellText(val) {
    if (val === null || val === undefined) return "-";
    if (typeof val === "number" && !Number.isInteger(val)) return val.toFixed(2);
    if (typeof val === "string" && DECIMAL_STR_RE.test(val)) return Number(val).toFixed(2);
    return String(val);
}

export default function Ewidencje() {
    const { data: meta, isLoading: metaLoading, isError: metaError } = useEwidencje();

    const [selectedKey, setSelectedKey] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [depot, setDepot] = useState("");
    // Parametry ostatniego kliknięcia "Pokaż dane" — dopiero one uruchamiają zapytanie.
    const [submitted, setSubmitted] = useState(null);
    const [snack, setSnack] = useState(null);
    const [exporting, setExporting] = useState(null); // "excel" | "pdf" | "preview" | null
    // Podgląd PDF: blob URL trzymany do zamknięcia okna, potem zwalniany.
    const [preview, setPreview] = useState(null); // { url, blob } | null

    const ewidencje = meta?.ewidencje ?? [];
    const depots = meta?.depots ?? [];
    const selected = ewidencje.find((e) => e.key === selectedKey) ?? null;

    const needsRange = selected?.dates === "range";
    const needsAsOf = selected?.dates === "asOf";
    const needsDepot = Boolean(selected?.depot);

    const filtersValid =
        selected &&
        (!needsRange || (dateFrom && dateTo)) &&
        (!needsAsOf || dateTo) &&
        (!needsDepot || depot);

    const currentFilters = useMemo(
        () => ({
            dateFrom: needsRange ? dateFrom : "",
            dateTo: needsRange || needsAsOf ? dateTo : "",
            depot: needsDepot ? depot : "",
        }),
        [needsRange, needsAsOf, needsDepot, dateFrom, dateTo, depot],
    );

    const {
        data: rows = [],
        isFetching,
        isError: dataError,
    } = useEwidencjaData(submitted?.key, submitted?.filters, Boolean(submitted));

    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    const { page, pageSize, pageRows, totalPages, setPage, setPageSize } = usePagination(rows, 25);

    const handleShow = () => setSubmitted({ key: selectedKey, filters: currentFilters });

    const fileSuffix =
        [currentFilters.dateFrom, currentFilters.dateTo].filter(Boolean).join("_") || "all";
    const pdfName = `${selectedKey}_${fileSuffix}.pdf`;

    const handleExport = async (kind) => {
        setExporting(kind);
        try {
            const fetcher = kind === "excel" ? fetchEwidencjaExcel : fetchEwidencjaPdf;
            const blob = await fetcher(selectedKey, currentFilters);
            downloadBlob(blob, `${selectedKey}_${fileSuffix}.${kind === "excel" ? "xlsx" : "pdf"}`);
        } catch (err) {
            setSnack(err.message || `Nie udało się wygenerować pliku ${kind === "excel" ? "Excel" : "PDF"}.`);
        } finally {
            setExporting(null);
        }
    };

    // Blob URL żyje tylko dopóki okno podglądu jest otwarte.
    const closePreview = () => {
        setPreview((current) => {
            if (current) URL.revokeObjectURL(current.url);
            return null;
        });
    };

    // Podgląd przed pobraniem — ten sam wydruk, tylko wyświetlony w <iframe>.
    const handlePreview = async () => {
        setExporting("preview");
        try {
            const blob = await fetchEwidencjaPdf(selectedKey, currentFilters);
            closePreview();
            setPreview({ url: URL.createObjectURL(blob), blob });
        } catch (err) {
            setSnack(err.message || "Nie udało się wygenerować podglądu PDF.");
        } finally {
            setExporting(null);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", px: 3, pt: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main", mb: 1.5 }}>
                Akcyza: Ewidencje akcyzowe-ESL
            </Typography>

            <Paper sx={{ p: 2, mb: 2, border: "1px solid #e0e0e0", boxShadow: "none", flexShrink: 0 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: "#666", fontWeight: "bold" }}>
                    Wybór ewidencji i zakresu dat
                </Typography>

                {metaError && (
                    <Alert severity="error" sx={{ mb: 2 }}>Nie udało się pobrać listy ewidencji.</Alert>
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

                    {needsRange && (
                        <Grid item xs={6} md={2}>
                            <TextField fullWidth size="small" type="date" label="Od"
                                       value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                                       InputLabelProps={{ shrink: true }} />
                        </Grid>
                    )}
                    {(needsRange || needsAsOf) && (
                        <Grid item xs={6} md={2}>
                            <TextField fullWidth size="small" type="date"
                                       label={needsRange ? "Do" : "Stan na dzień"}
                                       value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                                       InputLabelProps={{ shrink: true }} />
                        </Grid>
                    )}
                    {needsDepot && (
                        <Grid item xs={12} md={3}>
                            <TextField select fullWidth size="small" label="Skład podatkowy"
                                       value={depot} onChange={(e) => setDepot(e.target.value)}>
                                {depots.map((d) => (
                                    <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    )}

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
                            <Button variant="outlined"
                                    startIcon={exporting === "preview"
                                        ? <CircularProgress size={16} color="inherit" /> : <VisibilityIcon />}
                                    disabled={!filtersValid || exporting !== null}
                                    onClick={handlePreview}>
                                Podgląd PDF
                            </Button>
                            <Button variant="outlined" color="error"
                                    startIcon={exporting === "pdf"
                                        ? <CircularProgress size={16} color="inherit" /> : <PictureAsPdfIcon />}
                                    disabled={!filtersValid || exporting !== null}
                                    onClick={() => handleExport("pdf")}>
                                Pobierz PDF
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
                <Alert severity="error">Nie udało się pobrać danych ewidencji.</Alert>
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

            <Dialog open={Boolean(preview)} onClose={closePreview} fullWidth maxWidth="xl">
                <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, py: 1.25 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, flexGrow: 1 }}>
                        Podgląd wydruku — {selected?.name ?? selectedKey}
                    </Typography>
                    <IconButton size="small" onClick={closePreview}><CloseIcon fontSize="small" /></IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 0, height: "80vh" }}>
                    {preview && (
                        <iframe
                            src={preview.url}
                            title="Podgląd ewidencji akcyzowej"
                            style={{ width: "100%", height: "100%", border: 0 }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closePreview}>Zamknij</Button>
                    <Button variant="contained" startIcon={<DownloadIcon />}
                            onClick={() => { downloadBlob(preview.blob, pdfName); }}>
                        Pobierz PDF
                    </Button>
                </DialogActions>
            </Dialog>

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