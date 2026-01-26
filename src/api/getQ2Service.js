// src/services/getQ2Service.js
import axios from 'axios'

export const getQ2 = async (sampleId) => {
    const { data } = await axios.get(`http://chic-kubernetes.cluster.chic.eu:1891/api/V1/GetQ2/${sampleId}`);
    return data;
};
