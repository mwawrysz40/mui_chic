// src/components/TablePaginator.jsx
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/**
 * Pasek paginacji wyświetlany pod tabelą.
 *
 * Props:
 *  page        {number}   - aktualna strona (0-indexed)
 *  pageSize    {number}   - wierszy na stronę
 *  totalRows   {number}   - łączna liczba przefiltrowanych wierszy
 *  totalPages  {number}   - łączna liczba stron
 *  setPage     {Function}
 *  setPageSize {Function}
 */
export default function TablePaginator({
                                           page,
                                           pageSize,
                                           totalRows,
                                           totalPages,
                                           setPage,
                                           setPageSize,
                                       }) {
    const from = totalRows === 0 ? 0 : page * pageSize + 1;
    const to   = Math.min((page + 1) * pageSize, totalRows);

    return (
        <Box
            sx={{
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "space-between",
                flexWrap:        "wrap",
                gap:             1,
                px:              2,
                py:              1,
                borderTop:       "1px solid",
                borderColor:     "divider",
                bgcolor:         "background.paper",
                borderRadius:    "0 0 8px 8px",
            }}
        >
            {/* Lewa strona: "Wierszy na stronę" */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                    Wierszy na stronę:
                </Typography>
                <Select
                    size="small"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    sx={{
                        fontSize:        "12px",
                        height:          28,
                        ".MuiSelect-select": { py: "3px", pr: "24px !important", pl: "8px" },
                        ".MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
                    }}
                >
                    {PAGE_SIZE_OPTIONS.map((n) => (
                        <MenuItem key={n} value={n} sx={{ fontSize: "12px" }}>
                            {n}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            {/* Prawa strona: zakres + przyciski nawigacji */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 1, whiteSpace: "nowrap" }}>
                    {from}–{to} z {totalRows}
                </Typography>

                <Tooltip title="Pierwsza strona">
                    <span>
                        <IconButton size="small" onClick={() => setPage(0)} disabled={page === 0}
                                    sx={{ borderRadius: "6px" }}>
                            <FirstPageRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </span>
                </Tooltip>

                <Tooltip title="Poprzednia strona">
                    <span>
                        <IconButton size="small" onClick={() => setPage(page - 1)} disabled={page === 0}
                                    sx={{ borderRadius: "6px" }}>
                            <ChevronLeftRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </span>
                </Tooltip>

                {/* Numery stron */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, mx: 0.5 }}>
                    {buildPageNumbers(page, totalPages).map((item, i) =>
                        item === "…" ? (
                            <Typography key={`ellipsis-${i}`} variant="caption"
                                        color="text.disabled" sx={{ px: 0.5 }}>
                                …
                            </Typography>
                        ) : (
                            <IconButton
                                key={item}
                                size="small"
                                onClick={() => setPage(item)}
                                sx={{
                                    borderRadius: "6px",
                                    width:        28,
                                    height:       28,
                                    fontSize:     "12px",
                                    fontWeight:   item === page ? 700 : 400,
                                    bgcolor:      item === page ? "primary.main" : "transparent",
                                    color:        item === page ? "primary.contrastText" : "text.secondary",
                                    "&:hover": {
                                        bgcolor: item === page ? "primary.dark" : "action.hover",
                                    },
                                }}
                            >
                                {item + 1}
                            </IconButton>
                        )
                    )}
                </Box>

                <Tooltip title="Następna strona">
                    <span>
                        <IconButton size="small" onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1}
                                    sx={{ borderRadius: "6px" }}>
                            <ChevronRightRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </span>
                </Tooltip>

                <Tooltip title="Ostatnia strona">
                    <span>
                        <IconButton size="small" onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}
                                    sx={{ borderRadius: "6px" }}>
                            <LastPageRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>
        </Box>
    );
}

/**
 * Generuje uproszczoną listę numerów stron z elipsami.
 * Zawsze pokazuje: pierwszą, ostatnią, aktualną ± 1 oraz elipsy gdzie trzeba.
 */
function buildPageNumbers(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i);

    const pages = new Set([0, total - 1, current]);
    if (current > 0) pages.add(current - 1);
    if (current < total - 1) pages.add(current + 1);

    const sorted = [...pages].sort((a, b) => a - b);
    const result = [];

    for (let i = 0; i < sorted.length; i++) {
        if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
        result.push(sorted[i]);
    }

    return result;
}