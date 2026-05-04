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
                                       hideToggle = false // Nowy parametr, domyślnie false (przycisk widoczny)[cite: 4]
                                   }) {
    const [showFilters, setShowFilters] = useState(true);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
            <Box sx={{ flexShrink: 0, px: 3, pt: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
                        {title}
                    </Typography>

                    {/* Przycisk pokazuje się tylko, jeśli hideToggle jest false */}
                    {!hideToggle && (
                        <Button
                            variant="outlined"
                            startIcon={showFilters ? <FilterListOffIcon /> : <FilterListIcon />}
                            onClick={() => setShowFilters(prev => !prev)}
                        >
                            {showFilters ? "Ukryj filtry" : "Pokaż filtry"}
                        </Button>
                    )}
                </Box>

                {showFilters && FiltersComponent && (
                    <FiltersComponent filters={filters} setFilters={setFilters} />
                )}
            </Box>

            <Box sx={{ flexGrow: 1, px: 3, pb: 3, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {children}
            </Box>
        </Box>
    );
}