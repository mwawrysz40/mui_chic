// src/api/deleteSampleService.js
import axiosClient from "./axiosClient";

/**
 * Usuwa próbkę o podanym ID.
 * @param {string|number} sampleId - ID próbki do usunięcia
 * @returns {Promise<void>}
 */
export const deleteSample = async (sampleId) => {
    await axiosClient.delete(`/api/V1/DeleteSample/${sampleId}`);
};