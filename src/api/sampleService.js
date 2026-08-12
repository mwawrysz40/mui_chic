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
 * Pobiera próbki z API z paginacją/filtrami/sortem po stronie bazy.
 * @param {object} params - { page, pageSize, sortCol, sortDir, search, owner, batch, dateFrom, dateTo }
 * @returns {{ rows: Array, total: number }}
 */
export const fetchSamples = async (params = {}) => {
    try {
        const res = await axiosClient.get("/api/v1/GetSample", { params });
        const data = res.data || {};
        const raw = Array.isArray(data.rows) ? data.rows : [];

        // Mapujemy i normalizujemy dane, dodając ID dla Material UI
        const rows = raw.map((item, idx) => {
            const normalizedItem = normalizeObject(item);
            return {
                id: item.ID || idx, // Priorytet dla ID z bazy, jeśli nie ma - użyj indeksu
                ...normalizedItem
            };
        });
        return { rows, total: Number(data.total ?? rows.length) };
    } catch (err) {
        console.error("fetchSamples error", err);
        throw err;
    }
};
