// src/components/SortableHeaderCell.jsx
import React from "react";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import TableSortLabel from "@mui/material/TableSortLabel";

/**
 * Nagłówek kolumny z obsługą sortowania.
 *
 * Props:
 *  col        {object}          - definicja kolumny z config (id, label, sortable, ...)
 *  index      {number}          - pozycja kolumny (do sticky sx)
 *  stickySx   {object}          - style sticky wyliczone przez getStickySx
 *  sortCol    {string|null}     - aktualnie sortowana kolumna
 *  sortDir    {"asc"|"desc"}    - kierunek sortowania
 *  onSort     {Function}        - callback (colId) => void
 */
export default function SortableHeaderCell({ col, stickySx, sortCol, sortDir, onSort }) {
    const active = sortCol === col.id;

    if (col.sortable === false || col.id === "actions") {
        // Kolumna niesortowalna — zwykły nagłówek
        return (
            <TableCell sx={stickySx}>
                {col.label}
            </TableCell>
        );
    }

    return (
        <TableCell sx={{ ...stickySx, cursor: "pointer", userSelect: "none" }}>
            <TableSortLabel
                active={active}
                direction={active ? sortDir : "asc"}
                onClick={() => onSort(col.id)}
                sx={{
                    // Strzałka zawsze lekko widoczna (nie tylko on hover)
                    "& .MuiTableSortLabel-icon": {
                        opacity:    active ? 1 : 0.3,
                        transition: "opacity 0.15s, transform 0.2s",
                        fontSize:   "14px",
                    },
                    "&:hover .MuiTableSortLabel-icon": {
                        opacity: 0.7,
                    },
                    // Kolor aktywnej strzałki zgodny z primary
                    "&.Mui-active": {
                        color: "primary.main",
                        "& .MuiTableSortLabel-icon": {
                            color:   "primary.main",
                            opacity: 1,
                        },
                    },
                    fontSize:   "inherit",
                    fontWeight: "inherit",
                    color:      "inherit",
                    lineHeight: "inherit",
                    whiteSpace: stickySx?.whiteSpace,
                }}
            >
                {col.label}
                {/* Ukryty tekst dla screen-readerów */}
                {active && (
                    <Box component="span" sx={{ display: "none" }}>
                        {sortDir === "asc" ? " rosnąco" : " malejąco"}
                    </Box>
                )}
            </TableSortLabel>
        </TableCell>
    );
}