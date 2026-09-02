// src/api/ewidencjeService.js
import axiosClient from "./axiosClient.js";

/** Lista dostępnych ewidencji + opcje składów podatkowych. */
export async function fetchEwidencje() {
    const { data } = await axiosClient.get("/api/v1/ewidencje");
    return data; // { ewidencje: [{key,name,dates,depot}], depots: [{value,label}] }
}

function buildParams({ dateFrom, dateTo, depot }) {
    const params = {};
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    if (depot) params.depot = depot;
    return params;
}

/** Dane wybranej ewidencji (tabela). */
export async function fetchEwidencjaData(key, filters) {
    const { data } = await axiosClient.get(`/api/v1/ewidencje/${key}`, {
        params: buildParams(filters),
        timeout: 120_000, // część ewidencji liczy duże agregaty po OINM/OILM
    });
    return data;
}

/** Eksport ewidencji do xlsx. */
export async function fetchEwidencjaExcel(key, filters) {
    const { data } = await axiosClient.get(`/api/v1/ewidencje/${key}/excel`, {
        params: buildParams(filters),
        responseType: "blob",
        timeout: 120_000,
    });
    return data;
}

/** Wydruk ewidencji do pdf (układ wg wzoru). */
export async function fetchEwidencjaPdf(key, filters) {
    const { data } = await axiosClient.get(`/api/v1/ewidencje/${key}/pdf`, {
        params: buildParams(filters),
        responseType: "blob",
        timeout: 120_000,
    });
    return data;
}
