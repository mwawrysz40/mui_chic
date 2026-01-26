// src/api/updateService.js
import axios from "axios";
// import { clearSampleCache } from "./sampleService";

export const updateSample = async (updatedRecord) => {
    console.log('weszło do update sample', updatedRecord);
    try {
        const response = await axios.put(
            "http://chic-kubernetes.cluster.chic.eu:1891/api/v1/UpdateSample",
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

