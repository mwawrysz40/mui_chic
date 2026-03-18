

// src/api/wynikiService.js
import axiosClient from "./axiosClient";


export const fetchWynikiProbek = async () => {
    try {
        const response = await axiosClient.get("/api/v1/GetSampleResult"); // Dopasuj ścieżkę do swojego API
        return response.data;
    } catch (error) {
        console.error("Błąd podczas pobierania wyników próbek:", error);
        throw error;
    }
};