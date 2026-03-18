import axiosClient from "./axiosClient";

export const getQ2 = async (sampleId) => {
    const { data } = await axiosClient.get(`/api/V1/GetQ2/${sampleId}`);
    return data;
};
