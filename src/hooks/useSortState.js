import { useState } from "react";

/**
 * Stan sortowania dla tabel sterowanych serwerem (sam sort robi baza).
 * Zwraca { sortCol, sortDir, handleSort } — kliknięcie tej samej kolumny
 * przełącza kierunek, inna kolumna startuje od "asc".
 */
export function useSortState(defaultCol = null, defaultDir = "asc") {
    const [sortCol, setSortCol] = useState(defaultCol);
    const [sortDir, setSortDir] = useState(defaultDir);

    const handleSort = (colId) => {
        setSortDir((prev) => (sortCol === colId ? (prev === "asc" ? "desc" : "asc") : "asc"));
        setSortCol(colId);
    };

    return { sortCol, sortDir, handleSort };
}