// src/components/PageLayout.jsx
import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";

export default function PageLayout({
                                       title,
                                       filters,
                                       setFilters,
                                       FiltersComponent,
                                       children,
                                       hideToggle = false,
                                       headerExtra,
                                   }) {
    const [showFilters, setShowFilters] = useState(true);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

            {/* Górna sekcja — tytuł + filtry, nie rośnie */}
            <Box sx={{ flexShrink: 0, px: 3, pt: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
                        {title}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {headerExtra}
                        {!hideToggle && (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={showFilters ? <FilterListOffIcon /> : <FilterListIcon />}
                                onClick={() => setShowFilters(prev => !prev)}
                            >
                                {showFilters ? "Ukryj filtry" : "Pokaż filtry"}
                            </Button>
                        )}
                    </Box>
                </Box>

                {showFilters && FiltersComponent && (
                    <FiltersComponent filters={filters} setFilters={setFilters} />
                )}
            </Box>

            {/* Dolna sekcja — tabela, wypełnia całą pozostałą przestrzeń */}
            <Box sx={{ flexGrow: 1, px: 3, pb: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {children}
            </Box>
        </Box>
    );
}