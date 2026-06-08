// src/components/ResultEditModal.jsx
import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, CircularProgress, Alert, Snackbar
} from "@mui/material";
import { resultEditFields } from "../config/resultEditFields";
import { updateResultSample } from "../api/updateService";
import { useDictionary } from "../hooks/useDictionary.jsx";

export default function ResultEditModal({ open, row, onClose, onSaved }) {
    const dict = useDictionary();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (row) {
            setFormData(row);
            setError(null);
        }
    }, [row]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        try {
            await updateResultSample(formData);
            setSuccess(true);
            setTimeout(() => {
                onSaved();
                onClose();
            }, 1000);
        } catch (e) {
            setError(e.message || "Wystąpił błąd podczas zapisywania wyniku.");
        } finally {
            setLoading(false);
        }
    };

    if (!row) return null;

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>Edytuj Wynik: {row?.NrSample}</DialogTitle>

                <DialogContent dividers>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {resultEditFields.map((field) => (
                        <TextField
                            key={field.id}
                            name={field.id}
                            label={field.label}
                            fullWidth
                            margin="dense"
                            select={field.type === "select"}
                            value={formData[field.id] || ""}
                            onChange={handleChange}
                            disabled={field.disabled || loading}
                            multiline={field.multiline}
                            rows={field.rows}
                            InputLabelProps={{ shrink: true }}
                        >
                            {(field.dictType ? (dict[field.dictType] ?? []) : (field.options ?? [])).map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </TextField>
                    ))}
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>
                        Anuluj
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {loading ? "Zapisywanie..." : "Zapisz zmiany"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="success" variant="filled">
                    Wynik został pomyślnie zaktualizowany!
                </Alert>
            </Snackbar>
        </>
    );
}