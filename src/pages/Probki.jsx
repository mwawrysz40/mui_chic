// src/pages/Probki.jsx
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import { Button } from "@mui/material";
import SampleTable from "../components/SampleTable";
import SampleEditModal from "../components/SampleEditModal";
import SampleFilters from "../components/SampleFilters";

export default function Probki() {
    const [editRow, setEditRow] = useState(null);
    const [showFilters, setShowFilters] = useState(true); // Stan do ukrywania

    const [filters, setFilters] = useState({
        search: "",
        status: "",
        owner: "",
        type: ""
    });

    const [reload, setReload] = useState(false);

    const handleEdit = (row) => setEditRow(row);
    const handleClose = () => setEditRow(null);

    const handleSaved = () => {
        setReload((prev) => !prev);
        setEditRow(null); // warto dodać zamknięcie modala tutaj
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Nagłówek i przycisk w jednej linii */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    Laboratorium: Próbki
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={showFilters ? <FilterListOffIcon /> : <FilterListIcon />}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    {showFilters ? "Ukryj filtry" : "Pokaż filtry"}
                </Button>
            </Box>

            {/* 🔥 Warunkowe wyświetlanie filtrów */}
            {showFilters && (
                <SampleFilters filters={filters} setFilters={setFilters} />
            )}

            <SampleTable
                onEdit={handleEdit}
                filters={filters}
                reloadTrigger={reload}
            />

            <SampleEditModal
                row={editRow}
                open={Boolean(editRow)}
                onClose={handleClose}
                onSaved={handleSaved}
            />
        </Box>
    );
}