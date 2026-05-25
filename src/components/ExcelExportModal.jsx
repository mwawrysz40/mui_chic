// src/components/ExcelExportModal.jsx
import React, { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Box, Typography, Alert, CircularProgress
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import TableChartIcon from "@mui/icons-material/TableChart";
import { fetchExcel, downloadBlob } from "../api/excelService.js";

export default function ExcelExportModal({ open, onClose }) {
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo,   setDateTo]   = useState("");
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState(null);

    const handleDownload = async () => {
        setLoading(true);
        setError(null);
        try {
            const blob = await fetchExcel(dateFrom, dateTo);
            const date = new Date().toISOString().slice(0, 10);
            downloadBlob(blob, `ESL_Raport_${date}.xlsx`);
            onClose();
        } catch (err) {
            setError("Nie udało się pobrać pliku. Spróbuj ponownie.");
            console.error("Excel export error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading) return;
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TableChartIcon sx={{ color: "success.main" }} />
                Eksport do Excel
            </DialogTitle>

            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Wybierz zakres dat utworzenia próbek. Zostaw puste aby pobrać wszystkie rekordy.
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Data od"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ max: dateTo || undefined }}
                        fullWidth
                        size="small"
                    />
                    <TextField
                        label="Data do"
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: dateFrom || undefined }}
                        fullWidth
                        size="small"
                    />
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                <Button onClick={handleClose} disabled={loading} variant="outlined">
                    Anuluj
                </Button>
                <Button
                    onClick={handleDownload}
                    disabled={loading}
                    variant="contained"
                    color="success"
                    startIcon={
                        loading
                            ? <CircularProgress size={16} color="inherit" />
                            : <DownloadIcon />
                    }
                >
                    {loading ? "Pobieranie..." : "Pobierz Excel"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}