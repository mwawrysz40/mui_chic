// src/hooks/usePagination.js
import { useState, useEffect } from "react";

/**
 * Hook zarządzający paginacją po stronie klienta.
 *
 * @param {Array}  rows            - Przefiltrowane wiersze do paginacji
 * @param {number} defaultPageSize - Domyślna liczba wierszy na stronę (np. 25)
 * @returns {{
 *   page:          number,
 *   pageSize:      number,
 *   pageRows:      Array,
 *   totalPages:    number,
 *   setPage:       Function,
 *   setPageSize:   Function,
 * }}
 */
export function usePagination(rows, defaultPageSize = 25) {
    const [page, setPageRaw]         = useState(0); // 0-indexed
    const [pageSize, setPageSizeRaw] = useState(defaultPageSize);

    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

    // Gdy zmienią się dane (np. filtrowanie) — cofnij do pierwszej strony
    useEffect(() => {
        setPageRaw(0);
    }, [rows.length]);

    const setPage = (newPage) => {
        setPageRaw(Math.max(0, Math.min(newPage, totalPages - 1)));
    };

    const setPageSize = (newSize) => {
        setPageSizeRaw(newSize);
        setPageRaw(0); // reset do pierwszej strony przy zmianie rozmiaru
    };

    const pageRows = rows.slice(page * pageSize, page * pageSize + pageSize);

    return { page, pageSize, pageRows, totalPages, setPage, setPageSize };
}