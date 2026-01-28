import React, { useEffect, useState } from "react";
import {
    Dialog, AppBar, Toolbar, IconButton, Typography, Tabs, Tab, Box,
    CircularProgress, Grid, TextField, MenuItem, Button, Alert, Snackbar,
    DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { getFieldStyle } from "../config/Q2Validation.js";
import { getQ2 } from "../api/getQ2Service.js";
import { updateQ2 } from "../api/updateQ2.js";
import { Q2Tabs } from "../config/Q2Fields.js";

export default function Q2Modal({ open, sampleId, onClose }) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [formData, setFormData] = useState(null);
    const [originalData, setOriginalData] = useState(null); // Do porównywania zmian
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [confirmCloseOpen, setConfirmCloseOpen] = useState(false); // Modal potwierdzenia

    useEffect(() => {
        if (!open || !sampleId) return;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getQ2(sampleId);
                const record = data[0] || {};
                setFormData(record);
                setOriginalData(record); // Zapisujemy stan początkowy
            } catch (err) {
                console.error("Q2 error:", err);
                setError("Nie udało się pobrać danych pomiarowych.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [open, sampleId]);

    // Sprawdzamy, czy dane zostały zmienione
    const isDirty = JSON.stringify(formData) !== JSON.stringify(originalData);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            await updateQ2(formData);
            setSuccess(true);
            setOriginalData(formData); // Po zapisie dane w formularzu stają się "oryginalnymi"
        } catch (err) {
            setError(err.message || "Wystąpił błąd podczas zapisywania danych Q2.");
        } finally {
            setSaving(false);
        }
    };

    // Obsługa zamknięcia z kontrolą zmian
    const handleAttemptClose = () => {
        if (isDirty) {
            setConfirmCloseOpen(true); // Pokaż ostrzeżenie
        } else {
            onClose(); // Zamknij od razu
        }
    };

    const handleTabChange = (event, newValue) => setTabIndex(newValue);

    return (
        <>
            <Dialog fullScreen open={open} onClose={handleAttemptClose}>
                <AppBar sx={{ position: "relative" }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleAttemptClose} disabled={saving}>
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
                            Pomiary Q2 - {formData?.NrSample || "Ładowanie..."}
                            {isDirty && " (Niezapisane zmiany *)"}
                        </Typography>

                        <Button
                            color="inherit"
                            onClick={handleSave}
                            disabled={saving || loading || !formData || !isDirty} // Przycisk wyłączony, jeśli brak zmian
                            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        >
                            {saving ? "Zapisywanie..." : "Zapisz zmiany"}
                        </Button>
                    </Toolbar>
                </AppBar>

                <Box sx={{ p: 3 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress /></Box>
                    ) : (
                        <>
                            <Tabs value={tabIndex} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                                {Q2Tabs.map((tab) => <Tab key={tab.id} label={tab.label} />)}
                            </Tabs>

                            {formData && Q2Tabs.map((tab, idx) => (
                                <div key={tab.id} hidden={tabIndex !== idx}>
                                    {tabIndex === idx && (
                                        <Grid container spacing={2} sx={{ mt: 1 }}>
                                            {tab.fields.map((field) => (
                                                <Grid item xs={12} sm={6} md={4} key={field.id}>
                                                    <TextField
                                                        fullWidth
                                                        // Zmiana: selekt tylko gdy typ to 'select'
                                                        select={field.type === "select"}
                                                        label={field.label}
                                                        // Zmiana: przekazujemy typ 'date' lub 'number' bezpośrednio
                                                        type={field.type}
                                                        disabled={field.disabled || saving}
                                                        value={formData[field.id] ?? ""}
                                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                                        // Ważne dla pól typu 'date' - wymusza widoczność kalendarza
                                                        InputLabelProps={{ shrink: true }}
                                                        sx={{
                                                            "& .MuiInputBase-root": getFieldStyle(field.id, formData[field.id])
                                                        }}
                                                    >
                                                        {field.type === "select" &&
                                                            field.options?.map((option) => (
                                                                <MenuItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))}
                                                    </TextField>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </Box>

                <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)}>
                    <Alert severity="success" variant="filled">Pomiary Q2 zostały zapisane!</Alert>
                </Snackbar>
            </Dialog>

            {/* DIALOG POTWIERDZENIA WYJŚCIA */}
            <Dialog open={confirmCloseOpen} onClose={() => setConfirmCloseOpen(false)}>
                <DialogTitle>Niezapisane zmiany</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Wprowadziłeś zmiany w pomiarach, które nie zostały zapisane. Czy na pewno chcesz zamknąć okno i utracić te dane?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmCloseOpen(false)}>Wróć do edycji</Button>
                    <Button onClick={() => { setConfirmCloseOpen(false); onClose(); }} color="error">
                        Zamknij bez zapisywania
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}