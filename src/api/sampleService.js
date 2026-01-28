// src/api/sampleService.js
import axios from 'axios'

// 1. Funkcja normalizująca klucze (pozostaje bez zmian)
const normalizeKey = (key) =>
    key
        .replace(/\./g, '')
        .replace(/\s+/g, '_')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')

const normalizeObject = (obj) => {
    const out = {}
    Object.keys(obj).forEach((k) => {
        out[normalizeKey(k)] = obj[k]
    })
    return out
}

/**
 * Pobiera próbki z API.
 * USUNIĘTO CACHE: Teraz funkcja zawsze pobiera świeże dane z serwera.
 */
export const fetchSamples = async () => {
    try {
        // Używamy pełnego adresu zgodnie z Twoją konfiguracją
        const res = await axios.get('http://chic-kubernetes.cluster.chic.eu:1891/api/v1/GetSample');
        const raw = res.data;

        // Mapujemy i normalizujemy dane, dodając ID dla Material UI
        return raw.map((item, idx) => {
            const normalizedItem = normalizeObject(item);
            return {
                id: item.ID || idx, // Priorytet dla ID z bazy, jeśli nie ma - użyj indeksu
                ...normalizedItem
            };
        });
    } catch (err) {
        console.error("fetchSamples error", err);
        throw err;
    }
};

/**
 * Pobiera opcje filtrów na podstawie aktualnie pobranych danych.
 */
export async function fetchFilterOptions() {
    // Dzięki usunięciu cache wyżej, 'rows' zawsze będą aktualne
    const rows = await fetchSamples();

    const owners = new Set();
    const statuses = new Set();
    const types = new Set();
    const creates = new Set();

    rows.forEach((r) => {
        // UWAGA: Upewnij się, że te nazwy pól (person, typeResarch, itemCode)
        // są zgodne z tym, co wychodzi z normalizeKey!
        if (r.person) owners.add(r.person);
        if (r.typeResarch) statuses.add(r.typeResarch);
        if (r.itemCode) types.add(r.itemCode);
        if (r.createAt) creates.add(r.createAt);
    });

    return {
        owners: Array.from(owners).sort(),
        statuses: Array.from(statuses).sort(),
        types: Array.from(types).sort(),
        creates: Array.from(creates).sort(),
    };
}