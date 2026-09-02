// src/hooks/useServerTable.js
import { useState, useMemo } from "react";
import { useSortState } from "./useSortState.js";
import { useDebouncedValue } from "./useDebouncedValue.js";

/**
 * Wspólny stan tabeli serwerowej (Próbki/Wyniki): paginacja, sort, debounce
 * filtrów, reset strony przy zmianie filtra/sortu i parametry zapytania do API.
 *
 * `paramMap` mapuje klucze stanu filtrów strony na nazwy parametrów API
 * (np. createFrom → dateFrom); puste wartości filtrów są pomijane.
 *
 * Reset strony to wzorzec "dostosuj stan w trakcie renderu" (bez useEffect),
 * żeby zapytanie od razu szło po stronie 0.
 */
export function useServerTable(filters, paramMap) {
    const [page, setPageRaw] = useState(0);
    const [pageSize, setPageSizeRaw] = useState(25);
    const { sortCol, sortDir, handleSort } = useSortState();

    // Filtry tekstowe debounce'owane, by nie strzelać do API na każdą literę.
    const debouncedFilters = useDebouncedValue(filters, 300);

    const resetKey = `${JSON.stringify(debouncedFilters)}|${sortCol}|${sortDir}`;
    const [prevResetKey, setPrevResetKey] = useState(resetKey);
    let currentPage = page;
    if (prevResetKey !== resetKey) {
        setPrevResetKey(resetKey);
        if (page !== 0) setPageRaw(0);
        currentPage = 0;
    }

    const apiParams = useMemo(() => {
        const p = { page: currentPage, pageSize };
        if (sortCol) { p.sortCol = sortCol; p.sortDir = sortDir; }
        for (const [filterKey, paramKey] of Object.entries(paramMap)) {
            if (debouncedFilters[filterKey]) p[paramKey] = debouncedFilters[filterKey];
        }
        return p;
        // paramMap jest stałą modułową — celowo poza deps.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, pageSize, sortCol, sortDir, debouncedFilters]);

    /** Propsy dla <TablePaginator> — total znany dopiero po odpowiedzi API. */
    const paginatorProps = (total) => {
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        return {
            page: currentPage,
            pageSize,
            totalRows: total,
            totalPages,
            setPage: (n) => setPageRaw(Math.max(0, Math.min(n, totalPages - 1))),
            setPageSize: (s) => { setPageSizeRaw(s); setPageRaw(0); },
        };
    };

    return { apiParams, sortCol, sortDir, handleSort, pageSize, paginatorProps };
}
