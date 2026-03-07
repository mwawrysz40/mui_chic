

// src/api/wynikiService.js
import axiosClient from "./axiosClient";
const API_URL = import.meta.env.VITE_API_URL;

export const fetchWynikiProbek = async () => {
    try {
        const response = await axiosClient.get(`${API_URL}/api/v1/GetSampleResult`); // Dopasuj ścieżkę do swojego API
        return response.data;
    } catch (error) {
        console.error("Błąd podczas pobierania wyników próbek:", error);
        throw error;
    }
};