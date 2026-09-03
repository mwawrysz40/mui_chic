// src/pages/RaportRw.jsx
// Produkcja → Raport RW: zużycie z widoku RW_ZUZYCIE przestawione na miesiące,
// zakładka per typ RW (Zużycie w produkcji, Straty, Mini inwentura, …, PW)
// + eksport Excel z arkuszem per typ — układ jak w Node-RED.
import React, { useState } from "react";
import {
    Alert, Box, Paper, Skeleton, Snackbar, Tab, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Tabs, Typography,
} from "@mui/material";
import { useRaportRw } from "../hooks/queries.js";
import { fetchRaportRwExcel } from "../api/produkcjaService.js";
import { downloadBlob } from "../api/excelService.js";
import TablePaginator from "../components/TablePaginator.jsx";
import { usePagination } from "../hooks/usePagination.js";
import ReportFilterBar from "../components/produkcja/ReportFilterBar.jsx";
import { defaultRange, formatNumber } from "../config/produkcja.js";

const FIXED_COLUMNS = ["Indeks", "Nazwa", "Magazyn"];

const HEAD_SX = {
    fontWeight: 700,
    backgroundColor: "#faf9ff",
    whiteSpace: "normal",
    lineHeight: 1.3,
    verticalAlign: "bottom",
};

function RwTable({ months, rows }) {
    const { page, pageSize, pageRows, totalPages, setPage, setPageSize } = usePagination(rows, 25);
    const totals = months.map((m) => rows.reduce((acc, r) => acc + (Number(r[m]) || 0), 0));

    return (
        <>
            <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            {FIXED_COLUMNS.map((col) => (
                                <TableCell key={col} sx={{ ...HEAD_SX, minWidth: 110 }}>{col}</TableCell>
                            ))}
                            {months.map((m) => (
                                <TableCell key={m} align="right" sx={{ ...HEAD_SX, minWidth: 100 }}>{m}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pageRows.map((row, idx) => (
                            <TableRow key={idx} hover>
                                {FIXED_COLUMNS.map((col) => (
                                    <TableCell key={col} sx={{ whiteSpace: "nowrap" }}>{row[col] ?? "-"}</TableCell>
                                ))}
                                {months.map((m) => (
                                    <TableCell key={m} align="right" sx={{ whiteSpace: "nowrap" }}>
                                        {formatNumber(row[m] ?? 0)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        <TableRow sx={{ "& td": { fontWeight: 700, backgroundColor: "#faf9ff" } }}>
                            <TableCell>Razem</TableCell>
                            <TableCell colSpan={FIXED_COLUMNS.length - 1} />
                            {totals.map((t, i) => (
                                <TableCell key={months[i]} align="right">{formatNumber(t)}</TableCell>
                            ))}
                        </TableRow>
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
        </>
    );
}

export default function RaportRw() {
    const [range, setRange] = useState(defaultRange);
    const [submitted, setSubmitted] = useState(null);
    const [exporting, setExporting] = useState(false);
    const [snack, setSnack] = useState(null);
    const [tab, setTab] = useState("");

    const valid = Boolean(range.dateFrom && range.dateTo);
    const { data, isFetching, isError } = useRaportRw(submitted, Boolean(submitted));

    const months = data?.months ?? [];
    const types = data?.types ?? [];
    // Zakładka wyliczana z danych: gdy po nowym zapytaniu poprzednia zniknie,
    // pokazujemy pierwszą dostępną bez dodatkowego efektu.
    const activeType = types.find((t) => t.label === tab) ?? types[0] ?? null;

    const handleExcel = async () => {
        setExporting(true);
        try {
            const blob = await fetchRaportRwExcel(range);
            downloadBlob(blob, `Raport_RW_${range.dateFrom}_${range.dateTo}.xlsx`);
        } catch (err) {
            setSnack(err.message || "Nie udało się wygenerować pliku Excel.");
        } finally {
            setExporting(false);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", px: 3, pt: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main", mb: 1.5 }}>
                Produkcja: Raport RW
            </Typography>

            <ReportFilterBar
                subtitle="Zakres dat dokumentów RW / PW"
                dateFrom={range.dateFrom}
                dateTo={range.dateTo}
                onDateFrom={(v) => setRange((r) => ({ ...r, dateFrom: v }))}
                onDateTo={(v) => setRange((r) => ({ ...r, dateTo: v }))}
                valid={valid}
                loading={isFetching}
                onShow={() => setSubmitted({ ...range })}
                exporting={exporting}
                onExcel={handleExcel}
            />

            {isFetching ? (
                <Box>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} variant="rounded" height={44} sx={{ mb: 1 }} />
                    ))}
                </Box>
            ) : isError ? (
                <Alert severity="error">Nie udało się pobrać raportu RW.</Alert>
            ) : !submitted ? (
                <Alert severity="info">Podaj zakres dat i kliknij „Pokaż dane”.</Alert>
            ) : types.length === 0 ? (
                <Alert severity="info">Brak dokumentów RW / PW w wybranym okresie.</Alert>
            ) : (
                <Paper sx={{ display: "flex", flexDirection: "column", overflow: "hidden", mb: 1 }}>
                    <Tabs
                        value={activeType?.label ?? false}
                        onChange={(_e, v) => setTab(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ borderBottom: 1, borderColor: "divider", flexShrink: 0 }}
                    >
                        {types.map((t) => (
                            <Tab key={t.label} value={t.label}
                                 label={`${t.label} (${t.rows.length})`}
                                 sx={{ textTransform: "none" }} />
                        ))}
                    </Tabs>
                    {activeType && <RwTable key={activeType.label} months={months} rows={activeType.rows} />}
                </Paper>
            )}

            <Snackbar open={Boolean(snack)} autoHideDuration={6000} onClose={() => setSnack(null)}
                      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                {snack ? (
                    <Alert severity="error" variant="filled" onClose={() => setSnack(null)}>{snack}</Alert>
                ) : null}
            </Snackbar>
        </Box>
    );
}