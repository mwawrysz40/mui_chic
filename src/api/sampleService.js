// src/api/sampleService.js
import axiosClient from "./axiosClient";


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
        const res = await axiosClient.get("/api/v1/GetSample");
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
