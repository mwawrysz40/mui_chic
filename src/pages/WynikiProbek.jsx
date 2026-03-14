// src/pages/WynikiProbek.jsx
import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";

// Komponenty
import ResultTable from "../components/ResultTable"; // zmieniona nazwa
import WynikiFilters from "../components/ResultFilters.jsx";
import ResultEditModal from "../components/ResultEditModal";

export default function WynikiProbek() {
    // 1. Stany dla filtrów
    const [showFilters, setShowFilters] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        batch: ""
    });

    // 2. Stany dla edycji i przeładowania
    const [editRow, setEditRow] = useState(null);
    const [reload, setReload] = useState(false);

    // Handlery
    const handleEdit = (row) => setEditRow(row);
    const handleClose = () => setEditRow(null);

    const handleSaved = () => {
        setReload((prev) => !prev); // wyzwala useEffect w ResultTable
        setEditRow(null);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    Laboratorium: Wyniki Próbek
                </Typography>

                {/* Przycisk Pokaż/Ukryj filtry */}
                <Button
                    variant="outlined"
                    startIcon={showFilters ? <FilterListOffIcon /> : <FilterListIcon />}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    {showFilters ? "Ukryj filtry" : "Pokaż filtry"}
                </Button>
            </Box>

            {/* Warunkowe wyświetlanie filtrów */}
            {showFilters && (
                <WynikiFilters filters={filters} setFilters={setFilters} />
            )}

            {/* Tabela z zamrożoną kolumną i akcjami */}
            <ResultTable
                filters={filters}
                onEdit={handleEdit}
                reloadTrigger={reload}
            />

            {/* Modal edycji oparty na pliku konfiguracyjnym */}
            <ResultEditModal
                open={Boolean(editRow)}
                row={editRow}
                onClose={handleClose}
                onSaved={handleSaved}
            />
        </Box>
    );
}