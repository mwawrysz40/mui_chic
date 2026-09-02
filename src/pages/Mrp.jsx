// src/pages/Mrp.jsx
import React, { useMemo, useState } from "react";
import {
    Alert, Box, Button, Checkbox, Chip, CircularProgress, Grid, ListItemText,
    MenuItem, Paper, Skeleton, Snackbar, Table, TableBody, TableCell,
    TableContainer, TableFooter, TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DownloadIcon from "@mui/icons-material/Download";
import {
    useMrpFilters, useMrpData, useGenerateMrp, useUpdateMrp, useCreateMrpOrder,
} from "../hooks/queries.js";
import { fetchMrpOrderExcel, fetchMrpOrderPdf, fetchMrpReportExcel } from "../api/mrpService.js";
import { downloadBlob } from "../api/excelService.js";
import TablePaginator from "../components/TablePaginator.jsx";
import { usePagination } from "../hooks/usePagination.js";
import { MRP_LOW_STOCK_THRESHOLD } from "../config/constants.js";

const columns = [
    { id: "Indeks", label: "Indeks", minWidth: 130 },
    { id: "Nazwa", label: "Nazwa", minWidth: 320 },
    { id: "OnHand", label: "W magazynie", minWidth: 110 },
    { id: "Potwierdzone", label: "Potwierdzone", minWidth: 110 },
    { id: "Zamówione", label: "Zamówione", minWidth: 100 },
    { id: "Dostępne", label: "Dostępne", minWidth: 100 },
    { id: "ProdNie", label: "Ilość na PROD-NIE", minWidth: 130 },
    { id: "MRP", label: "MRP", minWidth: 120 },
];

// Rekord z niskim stanem magazynowym — kolorowany na czerwono.
const lowStockSx = {
    backgroundColor: "rgba(244, 67, 54, 0.14)",
    "&:hover": { backgroundColor: "rgba(244, 67, 54, 0.22) !important" },
};

function num(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

/** Pole MRP edytowalne w wierszu — zapis przy blur/Enter. */
function MrpCell({ row, onSave, saving }) {
    const [value, setValue] = useState(row.MRP ?? "");

    // Zsynchronizuj wartość po przeliczeniu tabeli (nowy obiekt wiersza).
    const [lastRow, setLastRow] = useState(row);
    if (lastRow !== row) {
        setLastRow(row);
        setValue(row.MRP ?? "");
    }

    const commit = () => {
        const parsed = value === "" ? null : num(value);
        if (parsed === num(row.MRP)) return;
        onSave({ ItemCode: row.Indeks, MRP: parsed });
    };

    return (
        <TextField
            size="small"
            type="number"
            value={value}
            disabled={saving}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
            inputProps={{ style: { fontSize: 13, padding: "4px 8px", width: 90 } }}
        />
    );
}

export default function Mrp() {
    const { data: opts, isLoading: optsLoading, isError: optsError } = useMrpFilters();
    const { data: rows = [], isLoading: dataLoading } = useMrpData();
    const generateMut = useGenerateMrp();
    const updateMut = useUpdateMrp();
    const orderMut = useCreateMrpOrder();

    const [filters, setFilters] = useState({
        kontrahent: "", marki: [], rynki: [], towary: [], adres: "1", osoba: "",
    });
    const [snack, setSnack] = useState(null); // { severity, message }

    const isHestia = filters.marki[0] === "Hestia";
    const canGenerate =
        filters.kontrahent && filters.marki.length > 0 && filters.towary.length > 0 &&
        (isHestia || filters.rynki.length > 0);

    const handleChange = (name) => (e) => {
        setFilters((prev) => ({ ...prev, [name]: e.target.value }));
    };

    const handleGenerate = async () => {
        try {
            const result = await generateMut.mutateAsync({
                kontrahent: filters.kontrahent,
                marki: filters.marki,
                rynki: filters.rynki,
                towary: filters.towary,
            });
            setSnack({ severity: "success", message: `Wygenerowano ${result.length} pozycji.` });
        } catch (err) {
            setSnack({ severity: "error", message: err.message || "Nie udało się wygenerować danych." });
        }
    };

    const handleOrder = async () => {
        try {
            const { DocNum } = await orderMut.mutateAsync({
                kontrahent: filters.kontrahent,
                adres: filters.adres,
                osoba: filters.osoba,
            });
            setSnack({ severity: "success", message: `Utworzono zamówienie ${DocNum} w SAP.` });
            const blob = await fetchMrpOrderExcel(DocNum, filters.kontrahent);
            downloadBlob(blob, `MRP_${DocNum}.xlsx`);
            // PDF renderuje zewnętrzny serwer Crystal — jego awaria nie unieważnia zamówienia.
            try {
                const pdf = await fetchMrpOrderPdf(DocNum);
                downloadBlob(pdf, `MRP_${DocNum}.pdf`);
            } catch {
                setSnack({
                    severity: "warning",
                    message: `Zamówienie ${DocNum} utworzone, ale nie udało się pobrać PDF z serwera Crystal.`,
                });
            }
        } catch (err) {
            setSnack({ severity: "error", message: err.message || "Nie udało się utworzyć zamówienia." });
        }
    };

    const handleReport = async () => {
        try {
            const blob = await fetchMrpReportExcel();
            downloadBlob(blob, `Planowanie_${new Date().toISOString().slice(0, 10)}.xlsx`);
        } catch (err) {
            setSnack({ severity: "error", message: err.message || "Nie udało się pobrać raportu." });
        }
    };

    const mrpSum = useMemo(
        () => rows.reduce((acc, r) => acc + (num(r.MRP) ?? 0), 0),
        [rows],
    );

    const { page, pageSize, pageRows, totalPages, setPage, setPageSize } = usePagination(rows, 50);

    const multiSelectProps = (options) => ({
        multiple: true,
        renderValue: (vals) =>
            vals.length <= 2
                ? vals.map((v) => options.find((o) => o.value === v)?.label ?? v).join(", ")
                : `${vals.length} wybrane`,
    });

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", px: 3, pt: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main", mb: 1.5 }}>
                Planowanie: MRP
            </Typography>

            <Paper sx={{ p: 2, mb: 2, border: "1px solid #e0e0e0", boxShadow: "none", flexShrink: 0 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: "#666", fontWeight: "bold" }}>
                    Parametry generowania
                </Typography>

                {optsError && (
                    <Alert severity="error" sx={{ mb: 2 }}>Nie udało się pobrać słowników MRP.</Alert>
                )}

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <TextField select fullWidth size="small" label="Kontrahent"
                            value={filters.kontrahent} onChange={handleChange("kontrahent")}
                            disabled={optsLoading}>
                            {(opts?.kontrahenci ?? []).map((o) => (
                                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField select fullWidth size="small" label="Marka"
                            value={filters.marki} onChange={handleChange("marki")}
                            disabled={optsLoading}
                            SelectProps={multiSelectProps(opts?.marki ?? [])}>
                            {(opts?.marki ?? []).map((o) => (
                                <MenuItem key={o.value} value={o.value}>
                                    <Checkbox size="small" checked={filters.marki.includes(o.value)} />
                                    <ListItemText primary={o.label} />
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField select fullWidth size="small" label="Towar"
                            value={filters.towary} onChange={handleChange("towary")}
                            disabled={optsLoading}
                            SelectProps={multiSelectProps(opts?.towary ?? [])}>
                            {(opts?.towary ?? []).map((o) => (
                                <MenuItem key={o.value} value={o.value}>
                                    <Checkbox size="small" checked={filters.towary.includes(o.value)} />
                                    <ListItemText primary={o.label} />
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField select fullWidth size="small" label="Rynek"
                            value={filters.rynki} onChange={handleChange("rynki")}
                            disabled={optsLoading || isHestia}
                            helperText={isHestia ? "Dla marki Hestia rynek jest pomijany" : undefined}
                            SelectProps={multiSelectProps(opts?.rynki ?? [])}>
                            {(opts?.rynki ?? []).map((o) => (
                                <MenuItem key={o.value} value={o.value}>
                                    <Checkbox size="small" checked={filters.rynki.includes(o.value)} />
                                    <ListItemText primary={o.label} />
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField select fullWidth size="small" label="Adres dostawy"
                            value={filters.adres} onChange={handleChange("adres")}>
                            {(opts?.adresy ?? []).map((o) => (
                                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField select fullWidth size="small" label="Osoba wystawiająca"
                            value={filters.osoba} onChange={handleChange("osoba")}>
                            {(opts?.osoby ?? []).map((o) => (
                                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                            <Button variant="contained" startIcon={generateMut.isPending
                                ? <CircularProgress size={16} color="inherit" /> : <PlayArrowIcon />}
                                disabled={!canGenerate || generateMut.isPending}
                                onClick={handleGenerate}>
                                Generuj dane
                            </Button>
                            <Button variant="contained" color="error"
                                startIcon={orderMut.isPending
                                    ? <CircularProgress size={16} color="inherit" /> : <AddShoppingCartIcon />}
                                disabled={!filters.kontrahent || !filters.osoba || rows.length === 0 || orderMut.isPending}
                                onClick={handleOrder}>
                                Dodaj do SAP
                            </Button>
                            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleReport}>
                                Raport braków (Excel)
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {dataLoading ? (
                <Box>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} variant="rounded" height={44} sx={{ mb: 1 }} />
                    ))}
                </Box>
            ) : rows.length === 0 ? (
                <Alert severity="info">
                    Brak danych — ustaw filtry i kliknij „Generuj dane”.
                </Alert>
            ) : (
                <Paper sx={{ display: "flex", flexDirection: "column", overflow: "hidden", mb: 1 }}>
                    <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    {columns.map((col) => (
                                        <TableCell key={col.id} sx={{ minWidth: col.minWidth, fontWeight: 700, backgroundColor: "#faf9ff" }}>
                                            {col.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pageRows.map((row) => {
                                    const lowStock = (num(row.OnHand) ?? 0) <= MRP_LOW_STOCK_THRESHOLD;
                                    return (
                                        <TableRow key={row.Indeks} hover sx={lowStock ? lowStockSx : undefined}>
                                            {columns.map((col) => (
                                                <TableCell key={col.id}>
                                                    {col.id === "MRP" ? (
                                                        <MrpCell
                                                            row={row}
                                                            saving={updateMut.isPending}
                                                            onSave={(payload) => updateMut.mutate(payload, {
                                                                onError: (err) => setSnack({
                                                                    severity: "error",
                                                                    message: err.message || "Nie udało się zapisać MRP.",
                                                                }),
                                                            })}
                                                        />
                                                    ) : (
                                                        row[col.id] ?? "-"
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={columns.length - 1} sx={{ fontWeight: 700, fontSize: 13 }}>
                                        Suma MRP
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>
                                        {mrpSum.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
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

            {rows.length > 0 && (
                <Box sx={{ mb: 1 }}>
                    <Chip size="small" sx={{ ...lowStockSx, fontSize: 11 }}
                        label={`Na czerwono: „W magazynie” ≤ ${MRP_LOW_STOCK_THRESHOLD}`} />
                </Box>
            )}

            <Snackbar
                open={Boolean(snack)}
                autoHideDuration={6000}
                onClose={() => setSnack(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                {snack ? (
                    <Alert severity={snack.severity} variant="filled" onClose={() => setSnack(null)}>
                        {snack.message}
                    </Alert>
                ) : null}
            </Snackbar>
        </Box>
    );
}
