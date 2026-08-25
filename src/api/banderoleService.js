// src/api/banderoleService.js
import axiosClient from "./axiosClient.js";

/** Lista dostępnych ewidencji banderol. */
export async function fetchBanderole() {
    const { data } = await axiosClient.get("/api/v1/banderole");
    return data; // { ewidencje: [{key,name}] }
}

function buildParams({ dateFrom, dateTo }) {
    return { dateFrom, dateTo };
}

/** Dane wybranej ewidencji banderol (tabela). */
export async function fetchBanderolaData(key, filters) {
    const { data } = await axiosClient.get(`/api/v1/banderole/${key}`, {
        params: buildParams(filters),
        timeout: 120_000,
    });
    return data;
}

/** Eksport ewidencji banderol do xlsx. */
export async function fetchBanderolaExcel(key, filters) {
    const { data } = await axiosClient.get(`/api/v1/banderole/${key}/excel`, {
        params: buildParams(filters),
        responseType: "blob",
        timeout: 120_000,
    });
    return data;
}

/** Wydruk ewidencji banderol do pdf (układ wg urzędowego wzoru). */
export async function fetchBanderolaPdf(key, filters) {
    const { data } = await axiosClient.get(`/api/v1/banderole/${key}/pdf`, {
        params: buildParams(filters),
        responseType: "blob",
        timeout: 120_000,
    });
    return data;
}