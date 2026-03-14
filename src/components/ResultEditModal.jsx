// src/components/ResultEditModal.jsx
import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import { resultEditFields } from "../config/resultEditFields";

export default function ResultEditModal({ open, row, onClose, onSaved }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (row) setFormData(row);
    }, [row]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        // Tu wywołaj swój serwis update, np. updateResult(formData)
        console.log("Zapisywanie wyniku:", formData);
        onSaved(); // Reload tabeli
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edytuj Wynik: {row?.NrSample}</DialogTitle>
            <DialogContent dividers>
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
                        disabled={field.disabled}
                        multiline={field.multiline}
                        rows={field.rows}
                    >
                        {field.options?.map(opt => (
                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                    </TextField>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Anuluj</Button>
                <Button onClick={handleSave} variant="contained">Zapisz zmiany</Button>
            </DialogActions>
        </Dialog>
    );
}