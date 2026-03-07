// src/pages/Próbki.jsx
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SampleTable from "../components/SampleTable";
import SampleEditModal from "../components/SampleEditModal";
import SampleFilters from "../components/SampleFilters";

export default function Probki() {
    const [editRow, setEditRow] = useState(null);

    const [filters, setFilters] = useState({
        search: "",
        status: "",
        owner: "",
        type: ""
    });

    // 🔥 sygnał do reloadu
    const [reload, setReload] = useState(false);

    const handleEdit = (row) => setEditRow(row);
    const handleClose = () => setEditRow(null);

    // 🔥 callback wywoływany po zapisaniu zmian
    const handleSaved = () => {
        // setEditRow(null);
        setReload((prev) => !prev); // ← przełącza i wywołuje reload
                   // zamyka modal
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Laboratorium: Próbki
            </Typography>

            {/* 🔥 Filtry kontrolowane */}
            <SampleFilters filters={filters} setFilters={setFilters} />


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
