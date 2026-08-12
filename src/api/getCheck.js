import axiosClient from "./axiosClient";

// Błędy normalizuje response-interceptor axiosClient ({ message, status }) —
// ręczne try/catch tylko dublowałoby tę obsługę.

// Filtr magazynu (whsCode) jest opcjonalny — pusty = wszystkie magazyny.
const whsParams = (whsCode) => (whsCode ? { params: { whsCode } } : undefined);

export const fetchGetCheck = async (whsCode) => {
    const response = await axiosClient.get("/api/v1/GetCheck", whsParams(whsCode));
    return response.data;
};

export const fetchGetDataQ2 = async (whsCode) => {
    const response = await axiosClient.get("/api/v1/GetDataQ2", whsParams(whsCode));
    return response.data;
};

/** Lista magazynów (WhsCode) na przyciski filtra dashboardu. */
export const fetchWarehouses = async () => {
    const response = await axiosClient.get("/api/v1/GetWarehouses");
    return response.data; // [{ whsCode }]
};

/** Pobranie PDF dashboardu zgodnego z filtrem (miesiąc + magazyn). */
export const fetchDashboardPdf = async ({ whsCode, month } = {}) => {
    const params = {};
    if (whsCode) params.whsCode = whsCode;
    if (month != null && month !== -1) params.month = month;
    const response = await axiosClient.get("/api/v1/GetDashboardPdf", {
        params,
        responseType: "blob",
        timeout: 60_000, // agregaty + render PDF bywają wolne; nadpisujemy globalne 5 s
    });
    return response.data;
};
