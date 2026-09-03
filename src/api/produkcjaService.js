// src/api/produkcjaService.js
import axiosClient from "./axiosClient.js";

// Widoki liczą agregaty po OWOR/OIGE/OIGN za cały zakres — dajemy im czas.
const TIMEOUT = 120_000;

function rangeParams({ dateFrom, dateTo }) {
    return { dateFrom, dateTo };
}

/** Raport miesięczny produkcji (widok Monthly_Report_Production) — wiersze. */
export async function fetchRaportMiesieczny(filters) {
    const { data } = await axiosClient.get("/api/v1/produkcja/raport-miesieczny", {
        params: rangeParams(filters),
        timeout: TIMEOUT,
    });
    return data;
}

/** Raport miesięczny — xlsx, arkusz per grupa. */
export async function fetchRaportMiesiecznyExcel(filters) {
    const { data } = await axiosClient.get("/api/v1/produkcja/raport-miesieczny/excel", {
        params: rangeParams(filters),
        responseType: "blob",
        timeout: TIMEOUT,
    });
    return data;
}

/** Raport RW (widok RW_ZUZYCIE) — { months: [...], types: [{ label, rows }] }. */
export async function fetchRaportRw(filters) {
    const { data } = await axiosClient.get("/api/v1/produkcja/raport-rw", {
        params: rangeParams(filters),
        timeout: TIMEOUT,
    });
    return data;
}

/** Raport RW — xlsx, arkusz per typ RW. */
export async function fetchRaportRwExcel(filters) {
    const { data } = await axiosClient.get("/api/v1/produkcja/raport-rw/excel", {
        params: rangeParams(filters),
        responseType: "blob",
        timeout: TIMEOUT,
    });
    return data;
}

/** Indeksy z dokumentami RW/PW w zakresie dat — opcje listy na wykresie. */
export async function fetchWykresRwItems(filters) {
    const { data } = await axiosClient.get("/api/v1/produkcja/wykres-rw/indeksy", {
        params: rangeParams(filters),
        timeout: TIMEOUT,
    });
    return data; // [{ Indeks, Nazwa }]
}

/** Wykres RW/PW dla indeksu (widok RW_ZUZYCIE_INDEKS) — { item, name, months, series }. */
export async function fetchWykresRw({ dateFrom, dateTo, item }) {
    const { data } = await axiosClient.get("/api/v1/produkcja/wykres-rw", {
        params: { dateFrom, dateTo, item },
        timeout: TIMEOUT,
    });
    return data;
}

/**
 * Wykres RW/PW — PDF (tabela liczona na serwerze + wykres). `svg` to
 * zserializowany element <svg> recharts z ekranu; backend osadza go wektorowo.
 */
export async function fetchWykresRwPdf({ dateFrom, dateTo, item, svg }) {
    const { data } = await axiosClient.post(
        "/api/v1/produkcja/wykres-rw/pdf",
        { dateFrom, dateTo, item, svg },
        { responseType: "blob", timeout: TIMEOUT },
    );
    return data;
}