// src/pages/ZleceniaProdukcyjne.jsx
import React, { useMemo, useState } from "react";
import {
    Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent,
    DialogTitle, IconButton, Paper, Skeleton, Snackbar, Tab, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Tooltip,
    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import TableViewIcon from "@mui/icons-material/TableView";
import {
    useZleceniaGroups, useZleceniaData, useUpdateZlecenieComment,
} from "../hooks/queries.js";
import { fetchZleceniaExcel } from "../api/productionOrdersService.js";
import { downloadBlob } from "../api/excelService.js";
import TablePaginator from "../components/TablePaginator.jsx";
import { usePagination } from "../hooks/usePagination.js";
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";

// Kolumny DECIMAL przychodzą z HANA jako stringi, np. "5000.000000".
const DECIMAL_STR_RE = /^-?\d+\.\d+$/;
const DATE_COLUMNS = new Set(["Data", "Data WZ", "Data rejestracji"]);

// Kolumna "Quality" z widoku: 'Zwolnione' / 'Zablokowane' / 'Niedostępne'.
const QUALITY_COLORS = { Zwolnione: "success.main", Zablokowane: "error.main" };

function cellColor(col, val) {
    if (col !== "Quality") return undefined;
    return QUALITY_COLORS[String(val ?? "").trim()];
}

function dateKey(val) {
    return val === null || val === undefined ? "" : String(val).slice(0, 10);
}

function cellText(col, val) {
    if (val === null || val === undefined || val === "") return "-";
    if (DATE_COLUMNS.has(col)) return dateKey(val);
    if (typeof val === "string" && DECIMAL_STR_RE.test(val)) {
        const n = Number(val);
        return Number.isInteger(n) ? String(n) : n.toFixed(2);
    }
    return String(val);
}

/** Podpis dialogu / tooltipa — nazwy pól edytowalnych w danej grupie. */
function editLabel(editable) {
    return editable.join(" / ");
}

/**
 * Dialog edycji pól dopisywanych w aplikacji. Zestaw pól zależy od grupy
 * (`editable` z /api/v1/zlecenia): FG/SFG/VUSE — sam komentarz,
 * P1 Rebanderoling — komentarz + Data WZ, Magazyn — komentarz + Data rejestracji.
 */
function CommentDialog({ row, editable, onClose, onSave, saving }) {
    const [komentarz, setKomentarz] = useState(row["Komentarz"] ?? "");
    const [dataWz, setDataWz] = useState(dateKey(row["Data WZ"]));
    const [dataRejestracji, setDataRejestracji] = useState(dateKey(row["Data rejestracji"]));

    const showWz = editable.includes("Data WZ");
    const showRejestracja = editable.includes("Data rejestracji");

    return (
        <Dialog open onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
            <DialogTitle>Zlecenie {row.NrDok} — {editLabel(editable)}</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth multiline minRows={3} label="Komentarz" sx={{ mt: 1, mb: 2 }}
                    value={komentarz} onChange={(e) => setKomentarz(e.target.value)}
                />
                {(showWz || showRejestracja) && (
                    <Box sx={{ display: "flex", gap: 2 }}>
                        {showWz && (
                            <TextField
                                fullWidth size="small" type="date" label="Data WZ"
                                value={dataWz} onChange={(e) => setDataWz(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        )}
                        {showRejestracja && (
                            <TextField
                                fullWidth size="small" type="date" label="Data rejestracji"
                                value={dataRejestracji} onChange={(e) => setDataRejestracji(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        )}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Anuluj</Button>
                <Button
                    variant="contained" disabled={saving}
                    startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                    onClick={() => onSave({
                        NrDok: String(row.NrDok),
                        Komentarz: komentarz,
                        DataWZ: showWz ? dataWz : "",
                        DataRejestracji: showRejestracja ? dataRejestracji : "",
                    })}
                >
                    Zapisz
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function ZleceniaProdukcyjne() {
    const { data: meta, isLoading: metaLoading, isError: metaError } = useZleceniaGroups();
    const groups = meta?.groups ?? [];

    const [groupKey, setGroupKey] = useState("");
    const activeKey = groupKey || groups[0]?.key || "";
    const group = groups.find((g) => g.key === activeKey) ?? null;

    const [search, setSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const debouncedSearch = useDebouncedValue(search, 300);

    const [editedRow, setEditedRow] = useState(null);
    const [snack, setSnack] = useState(null); // { severity, message }
    const [exporting, setExporting] = useState(false);

    const { data: rows = [], isLoading, isFetching, isError } = useZleceniaData(activeKey);
    const updateMut = useUpdateZlecenieComment();

    // Ten sam filtr stosuje backend przy eksporcie Excel (applyFilters).
    const filteredRows = useMemo(() => {
        const needle = debouncedSearch.trim().toLowerCase();
        return rows.filter((row) => {
            const d = dateKey(row["Data"]);
            if (dateFrom && (!d || d < dateFrom)) return false;
            if (dateTo && (!d || d > dateTo)) return false;
            if (!needle) return true;
            return Object.values(row).some(
                (v) => v !== null && v !== undefined && String(v).toLowerCase().includes(needle),
            );
        });
    }, [rows, debouncedSearch, dateFrom, dateTo]);

    const columns = group?.columns ?? [];
    const editable = group?.editable ?? ["Komentarz"];
    const { page, pageSize, pageRows, totalPages, setPage, setPageSize } =
        usePagination(filteredRows, 25);

    const handleTabChange = (_e, key) => {
        setGroupKey(key);
        setPage(0);
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const blob = await fetchZleceniaExcel(activeKey, {
                search: debouncedSearch.trim(),
                dateFrom,
                dateTo,
            });
            downloadBlob(blob, `Zlecenia_${activeKey}_${new Date().toISOString().slice(0, 10)}.xlsx`);
        } catch (err) {
            setSnack({ severity: "error", message: err.message || "Nie udało się wygenerować pliku Excel." });
        } finally {
            setExporting(false);
        }
    };

    const handleSave = (payload) => {
        updateMut.mutate({ ...payload, Group: activeKey }, {
            onSuccess: () => {
                setEditedRow(null);
                setSnack({ severity: "success", message: `Zapisano komentarz dla zlecenia ${payload.NrDok}.` });
            },
            onError: (err) =>
                setSnack({ severity: "error", message: err.message || "Nie udało się zapisać komentarza." }),
        });
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", px: 3, pt: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main", mb: 1.5 }}>
                Administracja: Spis zleceń produkcyjnych
            </Typography>

            {metaError && (
                <Alert severity="error" sx={{ mb: 2 }}>Nie udało się pobrać listy grup zleceń.</Alert>
            )}

            <Paper sx={{ mb: 2, border: "1px solid #e0e0e0", boxShadow: "none", flexShrink: 0 }}>
                <Tabs
                    value={activeKey || false}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: "1px solid #e0e0e0" }}
                >
                    {groups.map((g) => (
                        <Tab key={g.key} value={g.key} label={g.label} sx={{ textTransform: "none" }} />
                    ))}
                </Tabs>

                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center", p: 2 }}>
                    <TextField
                        size="small" label="Szukaj" sx={{ minWidth: 240 }}
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="nr zlecenia, indeks, partia…"
                    />
                    <TextField
                        size="small" type="date" label="Data od"
                        value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        size="small" type="date" label="Data do"
                        value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <Button
                        variant="outlined" color="success"
                        startIcon={exporting
                            ? <CircularProgress size={16} color="inherit" /> : <TableViewIcon />}
                        disabled={!group || exporting}
                        onClick={handleExport}
                    >
                        Excel
                    </Button>
                    {isFetching && !isLoading && <CircularProgress size={18} />}
                </Box>
            </Paper>

            {metaLoading || isLoading ? (
                <Box>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} variant="rounded" height={44} sx={{ mb: 1 }} />
                    ))}
                </Box>
            ) : isError ? (
                <Alert severity="error">Nie udało się pobrać zleceń produkcyjnych.</Alert>
            ) : filteredRows.length === 0 ? (
                <Alert severity="info">Brak zleceń spełniających kryteria.</Alert>
            ) : (
                <Paper sx={{ display: "flex", flexDirection: "column", overflow: "hidden", mb: 1 }}>
                    <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, backgroundColor: "#faf9ff", width: 48 }} />
                                    {columns.map((col) => (
                                        <TableCell key={col.id} sx={{
                                            fontWeight: 700,
                                            backgroundColor: "#faf9ff",
                                            whiteSpace: "normal",
                                            lineHeight: 1.3,
                                            minWidth: 100,
                                            verticalAlign: "bottom",
                                        }}>
                                            {col.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pageRows.map((row, idx) => (
                                    <TableRow key={`${row.NrDok}-${idx}`} hover>
                                        <TableCell sx={{ p: 0.5 }}>
                                            <Tooltip title={editLabel(editable)}>
                                                <IconButton size="small" onClick={() => setEditedRow(row)}>
                                                    <EditIcon fontSize="inherit" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        {columns.map((col) => (
                                            <TableCell key={col.id} sx={{
                                                whiteSpace: col.id === "Komentarz" ? "normal" : "nowrap",
                                                maxWidth: col.id === "Komentarz" ? 280 : undefined,
                                            }}>
                                                <Box component="span" sx={{
                                                    color: cellColor(col.id, row[col.id]),
                                                    fontWeight: col.id === "Quality" ? 600 : undefined,
                                                }}>
                                                    {cellText(col.id, row[col.id])}
                                                </Box>
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
                        totalRows={filteredRows.length}
                        totalPages={totalPages}
                        setPage={setPage}
                        setPageSize={setPageSize}
                    />
                </Paper>
            )}

            {editedRow && (
                <CommentDialog
                    key={editedRow.NrDok}
                    row={editedRow}
                    editable={editable}
                    saving={updateMut.isPending}
                    onClose={() => setEditedRow(null)}
                    onSave={handleSave}
                />
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