// src/api/excelService.js
import axiosClient from "./axiosClient.js";

/**
 * Pobiera raport Excel z backendu.
 * Backend zwraca bezpośrednio binarny plik xlsx (nie base64),
 * dlatego używamy responseType: 'blob'.
 *
 * @param {string} dateFrom  - data od, format YYYY-MM-DD (opcjonalna)
 * @param {string} dateTo    - data do, format YYYY-MM-DD (opcjonalna)
 * @returns {Promise<Blob>}
 */
export async function fetchExcel(dateFrom, dateTo) {
    const params = {};
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo)   params.dateTo   = dateTo;

    const response = await axiosClient.get("/api/v1/GetForExcel", {
        params,
        responseType: "blob", // kluczowe — bez tego axios potraktuje binarny plik jako tekst
    });

    return response.data; // Blob
}

/**
 * Pomocnik: tworzy tymczasowy link i klika go — uruchamia pobieranie pliku w przeglądarce.
 *
 * @param {Blob}   blob     - blob z odpowiedzi
 * @param {string} filename - proponowana nazwa pliku
 */
export function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement("a");
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // zwolnij pamięć
}