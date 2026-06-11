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
import { useUpdateQ2 } from "../hooks/queries.js";
import { Q2Tabs } from "../config/Q2Fields.js";
import { calculateNikoRAG } from "../config/Q2Calculations.js";
import { useDictionary } from "../hooks/useDictionary.jsx";

/**
 * Renderuje siatkę pól formularza z opcjonalną obsługą współrzędnych.
 *
 * Jeśli pole ma zdefiniowane `row`, pola są grupowane i sortowane wg rzędów.
 * Między każdą zmianą rzędu wstawiany jest separator (xs=12) który wymusza
 * nowy wiersz w Grid — dzięki temu col/row z Q2Fields.js działa jak CSS Grid.
 *
 * Jeśli żadne pole nie ma `row` — zachowanie identyczne jak poprzednio.
 */
function FieldsGrid({ fields, formData, saving, onFieldChange }) {
    const hasLayout = fields.some((f) => f.row != null);

    if (!hasLayout) {
        // Tryb domyślny — bez zmian w stosunku do starego kodu
        return (
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {fields.map((field) => (
                    <Grid item xs={12} sm={6} md={field.col ?? 4} key={field.id}>
                        <FieldInput
                            field={field}
                            formData={formData}
                            saving={saving}
                            onChange={onFieldChange}
                        />
                    </Grid>
                ))}
            </Grid>
        );
    }

    // Tryb z layoutem — grupujemy pola po rzędach
    const rowMap = new Map();
    fields.forEach((field) => {
        const r = field.row ?? 999; // pola bez row trafiają na koniec
        if (!rowMap.has(r)) rowMap.set(r, []);
        rowMap.get(r).push(field);
    });

    // Sortujemy rzędy rosnąco
    const sortedRows = [...rowMap.entries()].sort(([a], [b]) => a - b);

    return (
        <Grid container spacing={2} sx={{ mt: 1 }}>
            {sortedRows.map(([rowNum, rowFields]) => {
                // Automatyczna szerokość — 12 kolumn podzielone równo między pola w rzędzie.
                // Dla 1 pola = 12, dla 2 = 6, dla 3 = 4, dla 4 = 3, dla 6 = 2, itd.
                // Math.floor żeby nie wyjść poza 12 przy liczbach nierównych (np. 5 pól → 2).
                const autoCol = Math.floor(12 / rowFields.length) || 1;

                return (
                    <React.Fragment key={rowNum}>
                        {/* Separator rzędu — wymusza nowy wiersz w Grid */}
                        <Grid item xs={12} sx={{ p: '0 !important', height: 0 }} />

                        {rowFields.map((field) => (
                            <Grid item xs={12} md={autoCol} key={field.id}>
                                <FieldInput
                                    field={field}
                                    formData={formData}
                                    saving={saving}
                                    onChange={onFieldChange}
                                />
                            </Grid>
                        ))}
                    </React.Fragment>
                );
            })}
        </Grid>
    );
}

/** Pojedyncze pole formularza — wydzielone żeby FieldsGrid był czytelny */
function FieldInput({ field, formData, saving, onChange }) {
    // Hook musi być wywołany przed każdym warunkowym returnem (reguły hooków).
    // field.dictType ?? "" → "" zwraca [] z hooka, więc spacery i pola bez dictType są bezpieczne.
    const options = useDictionary(field.dictType ?? "");

    if (field.type === "spacer") return <Box />;

    return (
        <TextField
            fullWidth
            select={field.type === "select"}
            label={field.label}
            type={field.type}
            disabled={field.disabled || saving}
            value={formData[field.id] ?? ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
                "& .MuiInputBase-root": getFieldStyle(field.id, formData[field.id], formData),
            }}
        >
            {field.type === "select" &&
                options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
        </TextField>
    );
}

export default function Q2Modal({ open, sampleId, onClose }) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [formData, setFormData] = useState(null);
    const [originalData, setOriginalData] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
    const q2Mut = useUpdateQ2();

    useEffect(() => {
        if (!open || !sampleId) return;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getQ2(sampleId);
                const record = data[0] || {};
                setFormData(record);
                setOriginalData(record);
            } catch (err) {
                console.error("Q2 error:", err);
                setError("Nie udało się pobrać danych pomiarowych.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [open, sampleId]);

    const isDirty = JSON.stringify(formData) !== JSON.stringify(originalData);

    const handleChange = (field, value) => {
        setFormData((prev) => {
            const newData = { ...prev, [field]: value };
            if (field === "NikoM" || field === "NikoPR1" || field === "NikoPR2") {
                newData.NikoRAG1 = calculateNikoRAG(newData.NikoM, newData.NikoPR1, "NikoPR1");
                newData.NikoRAG2 = calculateNikoRAG(newData.NikoM, newData.NikoPR2, "NikoPR2");
            }
            return newData;
        });
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            await q2Mut.mutateAsync(formData);
            setSuccess(true);
            setOriginalData(formData);
        } catch (err) {
            setError(err.message || "Wystąpił błąd podczas zapisywania danych Q2.");
        } finally {
            setSaving(false);
        }
    };

    const handleAttemptClose = () => {
        if (isDirty) {
            setConfirmCloseOpen(true);
        } else {
            onClose();
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
                            disabled={saving || loading || !formData || !isDirty}
                            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        >
                            {saving ? "Zapisywanie..." : "Zapisz zmiany"}
                        </Button>
                    </Toolbar>
                </AppBar>

                <Box sx={{ p: 3 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <Tabs
                                value={tabIndex}
                                onChange={handleTabChange}
                                sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
                            >
                                {Q2Tabs.map((tab) => (
                                    <Tab key={tab.id} label={tab.label} />
                                ))}
                            </Tabs>

                            {formData &&
                                Q2Tabs.map((tab, idx) => (
                                    <div key={tab.id} hidden={tabIndex !== idx}>
                                        {tabIndex === idx && (
                                            <FieldsGrid
                                                fields={tab.fields}
                                                formData={formData}
                                                saving={saving}
                                                onFieldChange={handleChange}
                                            />
                                        )}
                                    </div>
                                ))}
                        </>
                    )}
                </Box>

                <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)}>
                    <Alert severity="success" variant="filled">
                        Pomiary Q2 zostały zapisane!
                    </Alert>
                </Snackbar>
            </Dialog>

            <Dialog open={confirmCloseOpen} onClose={() => setConfirmCloseOpen(false)}>
                <DialogTitle>Niezapisane zmiany</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Wprowadziłeś zmiany w pomiarach, które nie zostały zapisane. Czy na pewno chcesz zamknąć okno i utracić te dane?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmCloseOpen(false)}>Wróć do edycji</Button>
                    <Button
                        onClick={() => { setConfirmCloseOpen(false); onClose(); }}
                        color="error"
                    >
                        Zamknij bez zapisywania
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}