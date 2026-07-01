import axiosClient from "./axiosClient";

/**
 * Pobiera wyniki próbek z paginacją/filtrami/sortem po stronie bazy.
 * @param {object} params - { page, pageSize, sortCol, sortDir, search, status, batch, dateFrom, dateTo }
 * @returns {{ rows: Array, total: number }}
 */
export const fetchWynikiProbek = async (params = {}) => {
    try {
        const response = await axiosClient.get("/api/v1/GetSampleResult", { params });
        const data = response.data || {};
        return {
            rows: Array.isArray(data.rows) ? data.rows : [],
            total: Number(data.total ?? 0),
        };
    } catch (error) {
        console.error("Błąd podczas pobierania wyników próbek:", error);
        throw error;
    }
};