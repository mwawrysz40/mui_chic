// src/services/getQ2Service.js
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL;

export const getQ2 = async (sampleId) => {
    const { data } = await axios.get(`${API_URL}/api/V1/GetQ2/${sampleId}`);
    return data;
};
