// src/components/produkcja/ReportFilterBar.jsx
// Wspólny pasek filtrów raportów produkcyjnych: zakres dat, opcjonalne pola
// dodatkowe (np. indeks), przycisk "Pokaż dane" i opcjonalne eksporty
// (Excel — `onExcel`, PDF — `onPdf`; `pdfDisabled` blokuje PDF, gdy nie ma
// jeszcze czego drukować, np. wykres nie został wyrenderowany).
import React from "react";
import { Alert, Box, Button, CircularProgress, Grid, Paper, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TableViewIcon from "@mui/icons-material/TableView";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export default function ReportFilterBar({
                                            subtitle,
                                            dateFrom,
                                            dateTo,
                                            onDateFrom,
                                            onDateTo,
                                            extra,
                                            valid,
                                            loading,
                                            onShow,
                                            exporting,
                                            onExcel,
                                            exportingPdf,
                                            onPdf,
                                            pdfDisabled,
                                            error,
                                        }) {
    return (
        <Paper sx={{ p: 2, mb: 2, border: "1px solid #e0e0e0", boxShadow: "none", flexShrink: 0 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: "#666", fontWeight: "bold" }}>
                {subtitle}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6} md={2}>
                    <TextField fullWidth size="small" type="date" label="Od"
                               value={dateFrom} onChange={(e) => onDateFrom(e.target.value)}
                               InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={6} md={2}>
                    <TextField fullWidth size="small" type="date" label="Do"
                               value={dateTo} onChange={(e) => onDateTo(e.target.value)}
                               InputLabelProps={{ shrink: true }} />
                </Grid>
                {extra}

                <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                        <Button variant="contained" startIcon={<SearchIcon />}
                                disabled={!valid || loading}
                                onClick={onShow}>
                            Pokaż dane
                        </Button>
                        {onExcel && (
                            <Button variant="outlined" color="success"
                                    startIcon={exporting
                                        ? <CircularProgress size={16} color="inherit" /> : <TableViewIcon />}
                                    disabled={!valid || exporting}
                                    onClick={onExcel}>
                                Excel
                            </Button>
                        )}
                        {onPdf && (
                            <Button variant="outlined" color="error"
                                    startIcon={exportingPdf
                                        ? <CircularProgress size={16} color="inherit" /> : <PictureAsPdfIcon />}
                                    disabled={pdfDisabled || exportingPdf}
                                    onClick={onPdf}>
                                Pobierz PDF
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}