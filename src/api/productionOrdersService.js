// src/api/productionOrdersService.js
import axiosClient from "./axiosClient.js";

/** Lista grup (zakładek) spisu zleceń + definicje kolumn. */
export async function fetchZleceniaGroups() {
    const { data } = await axiosClient.get("/api/v1/zlecenia");
    return data; // { groups: [{key, label, columns: [{id, label}]}] }
}

/** Wiersze wybranej grupy (filtrowanie odbywa się po stronie klienta). */
export async function fetchZleceniaData(key) {
    const { data } = await axiosClient.get(`/api/v1/zlecenia/${key}`, {
        timeout: 60_000,
    });
    return data;
}

/** Eksport grupy do xlsx z aktualnymi filtrami tabeli. */
export async function fetchZleceniaExcel(key, { search, dateFrom, dateTo } = {}) {
    const params = {};
    if (search) params.search = search;
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    const { data } = await axiosClient.get(`/api/v1/zlecenia/${key}/excel`, {
        params,
        responseType: "blob",
        timeout: 60_000,
    });
    return data;
}

/** Zapis komentarza + Daty WZ + Daty rejestracji dla dokumentu w danej grupie. */
export async function updateZlecenieComment({ Group, NrDok, Komentarz, DataWZ, DataRejestracji }) {
    const { data } = await axiosClient.put("/api/v1/zlecenia/komentarz", {
        Group,
        NrDok,
        Komentarz,
        DataWZ,
        DataRejestracji,
    });
    return data;
}