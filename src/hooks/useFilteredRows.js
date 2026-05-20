// src/hooks/useFilteredRows.js
import { useMemo } from "react";

// Regex kompilowane raz — poza pętlą filtrowania
const ISO_RE = /^(\d{4}-\d{2}-\d{2})/;
const PL_RE  = /^(\d{2})\.(\d{2})\.(\d{4})/;

/**
 * Normalizuje datę z wiersza do formatu YYYY-MM-DD.
 * Obsługuje: "2024-05-10", "2024-05-10T12:34:56", "10.05.2024"
 * Zwraca null jeśli format nierozpoznany.
 */
function normalizeDate(rawValue) {
    const s = String(rawValue);
    const isoMatch = s.match(ISO_RE);
    if (isoMatch) return isoMatch[1];
    const plMatch = s.match(PL_RE);
    if (plMatch) return `${plMatch[3]}-${plMatch[2]}-${plMatch[1]}`;
    return null;
}

/**
 * Sprawdza czy pojedynczy wiersz pasuje do wszystkich aktywnych filtrów.
 *
 * WAŻNE: config powinien być stałą referencją (eksportowana stała z modułu),
 * żeby useMemo niżej nie traciło buforowania przy każdym renderze.
 */
function rowMatchesFilters(row, filters, config) {
    for (const entry of config) {
        const { filterKey, rowKey, rowKeys, match, fromKey, toKey } = entry;

        // ── dateRange ──────────────────────────────────────────────────────
        if (match === "dateRange") {
            const from = fromKey ? filters[fromKey] : "";
            const to   = toKey   ? filters[toKey]   : "";
            if (!from && !to) continue;

            const rawValue = row[rowKey];
            // Brak wartości w wierszu — nie spełnia filtru jeśli zakres ustawiony
            if (rawValue == null || rawValue === "") return false;

            const rowDate = normalizeDate(rawValue);
            if (!rowDate) return false;

            if (from && rowDate < from) return false;
            if (to   && rowDate > to)   return false;
            continue;
        }

        // ── pozostałe typy ─────────────────────────────────────────────────
        const filterValue = filters[filterKey];
        if (!filterValue || filterValue === "") continue;

        if (match === "includesAny") {
            const text = filterValue.toLowerCase();

            // Zawsze szukaj tylko w określonych polach (rowKeys).
            // Unikaj Object.values(row) — przy dużych tabelach to bottleneck.
            if (rowKeys && rowKeys.length > 0) {
                const found = rowKeys.some(key =>
                    String(row[key] ?? "").toLowerCase().includes(text)
                );
                if (!found) return false;
            } else {
                // Fallback: szukaj po wszystkich polach — działa, ale jest wolniejsze.
                // Aby poprawić wydajność, dodaj rowKeys w sampleFilterConfig.
                const found = Object.values(row).some(v =>
                    String(v ?? "").toLowerCase().includes(text)
                );
                if (!found) return false;
            }
            continue;
        }

        if (match === "includes") {
            const inRow = String(row[rowKey] ?? "").toLowerCase();
            if (!inRow.includes(filterValue.toLowerCase())) return false;
            continue;
        }

        if (match === "exact") {
            if (row[rowKey] !== filterValue) return false;
            continue;
        }
    }

    return true;
}

/**
 * Hook filtrujący wiersze tabeli.
 *
 * @param {Array}  rows    - surowe wiersze z API
 * @param {object} filters - aktualny stan filtrów
 * @param {Array}  config  - STAŁA referencja z pliku konfiguracyjnego
 */
export function useFilteredRows(rows, filters, config) {
    return useMemo(
        () => rows.filter(row => rowMatchesFilters(row, filters, config)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [rows, filters]
        // config celowo pominięty w deps — to stała eksportowana z modułu,
        // nigdy nie zmienia referencji między renderami.
    );
}