// src/pages/RaportMiesieczny.jsx
// Produkcja → Raport miesięczny: wiersze widoku Monthly_Report_Production
// za zakres dat produkcji + eksport Excel (arkusz per grupa, jak w Node-RED).
import React, { useState } from "react";
import {
    Alert, Box, Paper, Skeleton, Snackbar, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Typography,
} from "@mui/material";
import { useRaportMiesieczny } from "../hooks/queries.js";
import { fetchRaportMiesiecznyExcel } from "../api/produkcjaService.js";
import { downloadBlob } from "../api/excelService.js";
import TablePaginator from "../components/TablePaginator.jsx";
import { usePagination } from "../hooks/usePagination.js";
import ReportFilterBar from "../components/produkcja/ReportFilterBar.jsx";
import { defaultRange, formatNumber } from "../config/produkcja.js";

const NUMERIC = new Set(["ilosc wyprodukowana", "ilość ml/szt lub ml/gr", "ilość ml suma"]);
const SUMMED = ["ilosc wyprodukowana", "ilość ml suma"];

function cellText(col, val) {
    if (val === null || val === undefined || val === "") return "-";
    if (NUMERIC.has(col)) return formatNumber(val);
    return String(val);
}

export default function RaportMiesieczny() {
    const [range, setRange] = useState(defaultRange);
    const [submitted, setSubmitted] = useState(null);
    const [exporting, setExporting] = useState(false);
    const [snack, setSnack] = useState(null);

    const valid = Boolean(range.dateFrom && range.dateTo);
    const { data: rows = [], isFetching, isError } = useRaportMiesieczny(submitted, Boolean(submitted));

    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    const { page, pageSize, pageRows, totalPages, setPage, setPageSize } = usePagination(rows, 25);
    const totals = Object.fromEntries(
        SUMMED.map((c) => [c, rows.reduce((acc, r) => acc + (Number(r[c]) || 0), 0)]),
    );

    const handleExcel = async () => {
        setExporting(true);
        try {
            const blob = await fetchRaportMiesiecznyExcel(range);
            downloadBlob(blob, `Raport_miesieczny_${range.dateFrom}_${range.dateTo}.xlsx`);
        } catch (err) {
            setSnack(err.message || "Nie udało się wygenerować pliku Excel.");
        } finally {
            setExporting(false);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", px: 3, pt: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main", mb: 1.5 }}>
                Produkcja: Raport miesięczny
            </Typography>

            <ReportFilterBar
                subtitle="Zakres dat produkcji"
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
                <Alert severity="error">Nie udało się pobrać raportu miesięcznego.</Alert>
            ) : !submitted ? (
                <Alert severity="info">Podaj zakres dat i kliknij „Pokaż dane”.</Alert>
            ) : rows.length === 0 ? (
                <Alert severity="info">Brak produkcji w wybranym okresie.</Alert>
            ) : (
                <Paper sx={{ display: "flex", flexDirection: "column", overflow: "hidden", mb: 1 }}>
                    <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    {columns.map((col) => (
                                        <TableCell key={col} align={NUMERIC.has(col) ? "right" : "left"} sx={{
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
                                            <TableCell key={col} align={NUMERIC.has(col) ? "right" : "left"}
                                                       sx={{ whiteSpace: "nowrap" }}>
                                                {cellText(col, row[col])}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                                {/* Suma za cały zakres (nie tylko bieżącą stronę) — jak wiersz SUM w Excelu. */}
                                <TableRow sx={{ "& td": { fontWeight: 700, backgroundColor: "#faf9ff" } }}>
                                    {columns.map((col, i) => (
                                        <TableCell key={col} align={NUMERIC.has(col) ? "right" : "left"}>
                                            {i === 0 ? "Razem" : SUMMED.includes(col) ? formatNumber(totals[col]) : ""}
                                        </TableCell>
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