// src/pages/WynikiProbek.jsx
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import WynikiTable from "../components/ResultTable.jsx";
import WynikiFilters from "../components/ResultFilters.jsx";

export default function WynikiProbek() {
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        batch: ""
    });

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Laboratorium: Wyniki Próbek
            </Typography>

            {/* Komponent filtrów */}
            <WynikiFilters filters={filters} setFilters={setFilters} />

            {/* Tabela z przekazanymi filtrami */}
            <WynikiTable filters={filters} />
        </Box>
    );
}