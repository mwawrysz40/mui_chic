// src/api/banderoleService.js
import axiosClient from "./axiosClient.js";

/** Lista dostępnych ewidencji banderol. */
export async function fetchBanderole() {
    const { data } = await axiosClient.get("/api/v1/banderole");
    return data; // { ewidencje: [{key,name,selectItemCode}], sumColumns: [] }
}

/** Kody banderol dostępne w rejestrze zbiorczym (np. "Banderole powierzone"). */
export async function fetchBanderolaItemCodes(key) {
    const { data } = await axiosClient.get(`/api/v1/banderole/${key}/banderole`, {
        timeout: 120_000,
    });
    return data.banderole ?? [];
}

// itemCode dotyczy tylko rejestrów zbiorczych — poza nimi zostaje pusty.
function buildParams({ dateFrom, dateTo, itemCode }) {
    return itemCode ? { dateFrom, dateTo, itemCode } : { dateFrom, dateTo };
}

/** Dane wybranej ewidencji banderol (tabela). */
export async function fetchBanderolaData(key, filters) {
    const { data } = await axiosClient.get(`/api/v1/banderole/${key}`, {
        params: buildParams(filters),
        timeout: 120_000,
    });
    return data;
}

// Eksport do xlsx wyłączony — ewidencje banderol są składane wyłącznie
// na urzędowym wzorze PDF. Endpoint w backendzie też jest zakomentowany
// (backend/src/routes/banderole.ts).
// /** Eksport ewidencji banderol do xlsx. */
// export async function fetchBanderolaExcel(key, filters) {
//     const { data } = await axiosClient.get(`/api/v1/banderole/${key}/excel`, {
//         params: buildParams(filters),
//         responseType: "blob",
//         timeout: 120_000,
//     });
//     return data;
// }

/** Wydruk ewidencji banderol do pdf (układ wg urzędowego wzoru). */
export async function fetchBanderolaPdf(key, filters) {
    const { data } = await axiosClient.get(`/api/v1/banderole/${key}/pdf`, {
        params: buildParams(filters),
        responseType: "blob",
        timeout: 120_000,
    });
    return data;
}