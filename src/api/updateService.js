// src/api/updateService.js
import axiosClient from "./axiosClient";

/**
 * Aktualizuje rekord próbki.
 * Używane przez: SampleEditModal
 */
export const updateSample = async (updatedRecord) => {
    try {
        const response = await axiosClient.put(
            "/api/v1/UpdateSample",
            updatedRecord
        );
        return response.data;
    } catch (error) {
        console.error("Błąd aktualizacji próbki:", error);
        throw error;
    }
};

/**
 * Aktualizuje pomiary Q2 dla próbki.
 * Używane przez: Q2Modal
 */
export const updateQ2 = async (updatedRecord) => {
    try {
        const response = await axiosClient.put(
            "/api/v1/UpdateQ2",
            updatedRecord
        );
        return response.data;
    } catch (error) {
        console.error("Błąd aktualizacji Q2:", error);
        throw error;
    }
};
/**
 * Aktualizuje wynik próbki.
 * Używane przez: ResultEditModal
 */
export const updateResultSample = async (updatedRecord) => {
    try {
        const response = await axiosClient.put(
            "/api/v1/UpdateResultSample",
            updatedRecord
        );
        return response.data;
    } catch (error) {
        console.error("Błąd aktualizacji wyniku próbki:", error);
        throw error;
    }
};
export const unlockResultSample = async (id) => {
    try {
        const response = await axiosClient.put(
            `/api/v1/UnlockSample`,
            { id }  // id w body
        );
        return response.data;
    } catch (error) {
        console.error("Błąd odblokowania próbki:", error);
        throw error;
    }
};