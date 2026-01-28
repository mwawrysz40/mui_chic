// src/api/updateService.js
import axios from "axios";
// import { clearSampleCache } from "./sampleService";

export const updateQ2 = async (updatedRecord) => {
    //console.log('weszło do update sample', updatedRecord);
    try {
        const response = await axios.put(
            "http://chic-kubernetes.cluster.chic.eu:1891/api/v1/UpdateQ2",
            updatedRecord,

            {
                headers: { "Content-Type": "application/json" }
            }
        );

        return response.data;

    } catch (error) {
        console.error("❌ Błąd aktualizacji Q2:", error);
        throw error;
    }
};

