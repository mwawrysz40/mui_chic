import React, { useEffect, useState } from "react";
import { sampleEditFields } from "../config/sampleEditFields.js";
import { updateSample } from "../api/updateService";
// ... (zachowaj dotychczasowe importy)
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Button, CircularProgress, Alert, Snackbar
} from "@mui/material";

export default function SampleEditModal({ open, row, onClose, onSaved }) {
    const [formState, setFormState] = useState({});
    const [loading, setLoading] = useState(false); // Stan ładowania
    const [error, setError] = useState(null);       // Stan błędu
    const [success, setSuccess] = useState(false); // Stan sukcesu (opcjonalnie)

    useEffect(() => {
        if (row) {
            setFormState(row);
            setError(null); // Resetuj błąd przy otwieraniu nowej edycji
        }
    }, [row]);
    const handleChange = (field, value) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };
    const handleSave = async () => {
        setLoading(true);
        setError(null);
        try {
            await updateSample(formState);
            setSuccess(true); // Aktywuj informację o sukcesie

            // Dajemy użytkownikowi chwilę na zobaczenie sukcesu przed zamknięciem
            setTimeout(() => {
                onSaved();
                onClose();
            }, 1000);

        } catch (e) {
            console.error("Błąd zapisu:", e);
            // Wyświetlamy komunikat z axiosClient (ten, który przygotowaliśmy wcześniej)
            setError(e.message || "Wystąpił nieoczekiwany błąd zapisu.");
        } finally {
            setLoading(false);
        }
    };

    if (!row) return null;

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ textAlign: "center", pb: 2 }}>
                    Edytuj rekord — {row?.sampleNumber || "—"}
                </DialogTitle>

                <DialogContent dividers>
                    {/* WYŚWIETLANIE BŁĘDU WEWNĄTRZ MODALA */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {sampleEditFields.map((field) => (
                        <div key={field.id}>
                            {field.type !== "hidden" && (
                                <TextField
                                    label={field.label}
                                    type={field.type}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    disabled={loading} // Blokuj pola podczas zapisu
                                    value={formState[field.id] || ""}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            )}
                        </div>
                    ))}
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>Anuluj</Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {loading ? "Zapisywanie..." : "Zapisz"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* POWIADOMIENIE O SUKCESIE (Snackbar) */}
            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled">
                    Dane zostały pomyślnie zaktualizowane!
                </Alert>
            </Snackbar>
        </>
    );
}