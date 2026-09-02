// src/api/mrpService.js
import axiosClient from "./axiosClient.js";

/** Opcje filtrów MRP (kontrahenci, marki, rynki z HANA + listy z konfiguracji). */
export async function fetchMrpFilters() {
    const { data } = await axiosClient.get("/api/v1/mrp/filters", { timeout: 60_000 });
    return data;
}

/** Aktualna zawartość tabeli roboczej _ESL_MRP. */
export async function fetchMrpData() {
    const { data } = await axiosClient.get("/api/v1/mrp");
    return data;
}

/**
 * Przelicza MRP dla wybranych filtrów i odbudowuje tabelę roboczą.
 * @param {{kontrahent:string, marki:string[], rynki:string[], towary:string[]}} payload
 */
export async function generateMrp(payload) {
    const { data } = await axiosClient.post("/api/v1/mrp/generate", payload, {
        timeout: 120_000, // ciężkie zapytanie po OITM/OITW + przebudowa tabeli
    });
    return data;
}

/** Zapis ręcznie poprawionej ilości MRP. */
export async function updateMrp({ ItemCode, MRP }) {
    const { data } = await axiosClient.put("/api/v1/mrp", { ItemCode, MRP });
    return data;
}

/**
 * Tworzy zamówienie zakupu w SAP z pozycji MRP > 0.
 * @param {{kontrahent:string, adres:string, osoba:string}} payload
 * @returns {Promise<{DocNum:number, DocEntry:number}>}
 */
export async function createMrpOrder(payload) {
    const { data } = await axiosClient.post("/api/v1/mrp/order", payload, { timeout: 120_000 });
    return data;
}

/** Excel utworzonego zamówienia (z arkuszem QR dla wybranych kontrahentów). */
export async function fetchMrpOrderExcel(docNum, kontrahent) {
    const { data } = await axiosClient.get(`/api/v1/mrp/order/${docNum}/excel`, {
        params: { kontrahent },
        responseType: "blob",
        timeout: 60_000,
    });
    return data;
}

/** PDF zamówienia generowany przez serwer Crystal (raport POR20003). */
export async function fetchMrpOrderPdf(docNum) {
    const { data } = await axiosClient.get(`/api/v1/mrp/order/${docNum}/pdf`, {
        responseType: "blob",
        timeout: 120_000, // Crystal renderuje raport po swojej stronie — bywa wolny
    });
    return data;
}

/** Raport braków pod planowanie produkcji (xlsx). */
export async function fetchMrpReportExcel() {
    const { data } = await axiosClient.get("/api/v1/mrp/report/excel", {
        responseType: "blob",
        timeout: 120_000,
    });
    return data;
}
