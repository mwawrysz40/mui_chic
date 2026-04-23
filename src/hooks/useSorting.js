// src/hooks/useSorting.js
import { useState, useMemo } from "react";

/**
 * Hook zarządzający sortowaniem po stronie klienta.
 *
 * @param {Array}  rows       - Wiersze do posortowania (przefiltrowane)
 * @param {string} defaultCol - ID kolumny domyślnie sortowanej (opcjonalne)
 * @param {"asc"|"desc"} defaultDir - Domyślny kierunek (opcjonalne)
 * @returns {{
 *   sortedRows: Array,
 *   sortCol:    string | null,
 *   sortDir:    "asc" | "desc",
 *   handleSort: (colId: string) => void,
 * }}
 */
export function useSorting(rows, defaultCol = null, defaultDir = "asc") {
    const [sortCol, setSortCol] = useState(defaultCol);
    const [sortDir, setSortDir] = useState(defaultDir);

    const handleSort = (colId) => {
        setSortDir((prev) =>
            sortCol === colId ? (prev === "asc" ? "desc" : "asc") : "asc"
        );
        setSortCol(colId);
    };

    const sortedRows = useMemo(() => {
        if (!sortCol) return rows;

        return [...rows].sort((a, b) => {
            const aVal = a[sortCol];
            const bVal = b[sortCol];

            // null / undefined zawsze na koniec
            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return 1;
            if (bVal == null) return -1;

            // Daty (string ISO lub dd.mm.yyyy)
            if (isDateString(aVal) && isDateString(bVal)) {
                const diff = parseDate(aVal) - parseDate(bVal);
                return sortDir === "asc" ? diff : -diff;
            }

            // Liczby
            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortDir === "asc" ? aVal - bVal : bVal - aVal;
            }

            // Stringi — locale-aware, obsługuje polskie znaki
            const cmp = String(aVal).localeCompare(String(bVal), "pl", { sensitivity: "base" });
            return sortDir === "asc" ? cmp : -cmp;
        });
    }, [rows, sortCol, sortDir]);

    return { sortedRows, sortCol, sortDir, handleSort };
}

// ── helpers ──────────────────────────────────────────────────────────────────

function isDateString(val) {
    if (typeof val !== "string") return false;
    return (
        /^\d{4}-\d{2}-\d{2}/.test(val) ||   // ISO: 2024-01-15
        /^\d{2}\.\d{2}\.\d{4}/.test(val)     // PL:  15.01.2024
    );
}

function parseDate(val) {
    if (/^\d{2}\.\d{2}\.\d{4}/.test(val)) {
        const [d, m, y] = val.split(".");
        return new Date(`${y}-${m}-${d}`).getTime();
    }
    return new Date(val).getTime();
}