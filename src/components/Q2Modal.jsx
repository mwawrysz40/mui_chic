import React, { useEffect, useState } from "react";
import {
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Tabs,
    Tab,
    Box,
    CircularProgress,
    Grid,
    TextField,
    MenuItem
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { getQ2} from "../api/getQ2Service.js";
import { Q2Tabs } from "../config/Q2Fields.js";

export default function Q2Modal({ open, sampleId, onClose }) {
    const [loading, setLoading] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        if (!open || !sampleId) return;

        const load = async () => {
            setLoading(true);
            try {
                const data = await getQ2(sampleId);
                setFormData(data[0] || {});
            } catch (err) {
                console.error("Q2 error:", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [open, sampleId]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            {/* NAVBAR */}
            <AppBar sx={{ position: "relative" }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>

                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
                        Q2 – Szczegóły (ID: {sampleId})
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* TABY */}
            <Tabs
                value={tabIndex}
                onChange={(_, v) => setTabIndex(v)}
                sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
            >
                {Q2Tabs.map((tab) => (
                    <Tab key={tab.id} label={tab.label} />
                ))}
            </Tabs>

            <Box sx={{ p: 3 }}>
                {loading && (
                    <Box sx={{ textAlign: "center", mt: 5 }}>
                        <CircularProgress />
                    </Box>
                )}

                {!loading && formData && (
                    <>
                        {Q2Tabs.map((tab, index) => (
                            <div
                                key={tab.id}
                                hidden={tabIndex !== index}
                                style={{ marginTop: "10px" }}
                            >
                                {tabIndex === index && (
                                    <Grid container spacing={2}>
                                        {tab.fields.map((field) => (
                                            <Grid key={field.id} item xs={12} md={4}>
                                                <TextField
                                                    fullWidth
                                                    select={field.type === "select"}
                                                    type={field.type !== "select" ? field.type || "text" : undefined}
                                                    label={field.label}
                                                    disabled={field.disabled}
                                                    value={formData[field.id] ?? ""}
                                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                                    InputLabelProps={
                                                        { shrink: true }
                                                    }
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
        </Dialog>
    );
}
