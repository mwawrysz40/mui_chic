// src/components/PageLayout.jsx
import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";

/**
 * Wspólny layout dla stron z tabelą i filtrami.
 *
 * Props:
 *  - title       {string}      — tytuł strony (np. "Laboratorium: Próbki")
 *  - filters     {object}      — stan filtrów z rodzica
 *  - setFilters  {function}    — setter filtrów z rodzica
 *  - FiltersComponent {React.Component} — komponent filtrów (SampleFilters / ResultFilters)
 *  - children    {ReactNode}   — tabela + modal przekazane jako dzieci
 */
export default function PageLayout({ title, filters, setFilters, FiltersComponent, children }) {
    const [showFilters, setShowFilters] = useState(true);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

            {/* Sekcja stała — tytuł + filtry */}
            <Box sx={{ flexShrink: 0, px: 3, pt: 3 }}>

                {/* Nagłówek + przycisk toggle filtrów */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
                        {title}
                    </Typography>

                    <Button
                        variant="outlined"
                        startIcon={showFilters ? <FilterListOffIcon /> : <FilterListIcon />}
                        onClick={() => setShowFilters(prev => !prev)}
                    >
                        {showFilters ? "Ukryj filtry" : "Pokaż filtry"}
                    </Button>
                </Box>

                {/* Filtry — warunkowo widoczne */}
                {showFilters && FiltersComponent && (
                    <FiltersComponent filters={filters} setFilters={setFilters} />
                )}

            </Box>

            {/* Tabela — wypełnia resztę wysokości i przewija się pionowo */}
            <Box sx={{ flexGrow: 1, px: 3, pb: 3, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {children}
            </Box>

        </Box>
    );
}