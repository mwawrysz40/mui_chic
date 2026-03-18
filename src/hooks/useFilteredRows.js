// src/hooks/useFilteredRows.js
//
// Uniwersalny hook do filtrowania wierszy tabeli na podstawie konfiguracji.
// Używany przez SampleTable i ResultTable — ale może obsłużyć każdą tabelę
// w projekcie bez żadnych zmian.
//
// Użycie:
//   const filteredRows = useFilteredRows(rows, filters, sampleFilterConfig);

import { useMemo } from "react";

/**
 * Sprawdza czy pojedynczy wiersz pasuje do wszystkich aktywnych filtrów.
 */
function rowMatchesFilters(row, filters, config) {
    return config.every(({ filterKey, rowKey, rowKeys, match }) => {
        const filterValue = filters[filterKey];

        // Jeśli filtr jest pusty — wiersz zawsze pasuje
        if (!filterValue || filterValue === "") return true;

        if (match === "includesAny") {
            const text = filterValue.toLowerCase();

            // Jeśli podano rowKeys — szukamy tylko w tych polach
            if (rowKeys && rowKeys.length > 0) {
                return rowKeys.some(key =>
                    String(row[key] ?? "").toLowerCase().includes(text)
                );
            }

            // Brak rowKeys — szukamy po wszystkich polach wiersza
            return Object.values(row).some(v =>
                String(v ?? "").toLowerCase().includes(text)
            );
        }

        if (match === "includes") {
            return String(row[rowKey] ?? "")
                .toLowerCase()
                .includes(filterValue.toLowerCase());
        }

        if (match === "exact") {
            return row[rowKey] === filterValue;
        }

        return true;
    });
}

export function useFilteredRows(rows, filters, config) {
    return useMemo(
        () => rows.filter(row => rowMatchesFilters(row, filters, config)),
        [rows, filters, config]
    );
}