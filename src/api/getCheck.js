import axiosClient from "./axiosClient";

// Filtr magazynu (whsCode) jest opcjonalny — pusty = wszystkie magazyny.
const whsParams = (whsCode) => (whsCode ? { params: { whsCode } } : undefined);

export const fetchGetCheck = async (whsCode) => {
    try {
        const response = await axiosClient.get("/api/v1/GetCheck", whsParams(whsCode));
        return response.data;
    } catch (error) {
        console.error("Błąd fetchGetCheck:", {
            message: error.message,
            status:  error.response?.status,
            data:    error.response?.data,
            url:     error.config?.url,
        });
        throw error;
    }
};

export const fetchGetDataQ2 = async (whsCode) => {
    try {
        const response = await axiosClient.get("/api/v1/GetDataQ2", whsParams(whsCode));
        return response.data;
    } catch (error) {
        console.error("Błąd fetchGetDataQ2:", {
            message: error.message,
            status:  error.response?.status,
            data:    error.response?.data,
            url:     error.config?.url,
        });
        throw error;
    }
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
    });
    return response.data;
};