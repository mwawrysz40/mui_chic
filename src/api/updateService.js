// src/api/updateService.js
import axios from "axios";

// import { clearSampleCache } from "./sampleService";

export const updateSample = async (updatedRecord) => {
    const API_URL = import.meta.env.VITE_API_URL;
    console.log(API_URL);
    try {
        const response = await axios.put(
            `${API_URL}/api/v1/UpdateSample`,
            updatedRecord,

            {
                headers: { "Content-Type": "application/json" }
            }
        );

        return response.data;

    } catch (error) {
        console.error("❌ Błąd aktualizacji próbki:", error);
        throw error;
    }
};

