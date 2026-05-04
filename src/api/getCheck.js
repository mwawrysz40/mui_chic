import axiosClient from "./axiosClient";

export const fetchGetCheck = async () => {
    try {
        const response = await axiosClient.get("/api/v1/GetCheck");
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

export const fetchGetDataQ2 = async () => {
    try {
        const response = await axiosClient.get("/api/v1/GetDataQ2");
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