import axiosClient from "./axiosClient";

/**
 * Pobiera słownik wszystkich aktywnych wartości wybieralnych z API.
 * Zwraca obiekt pogrupowany po typie, np.:
 *   { PERSON: [{label, value}, ...], DEFECT_DROPP_A: [...], ... }
 */
export const getDictionary = async () => {
    const { data } = await axiosClient.get("/api/v1/GetDictionary");
    return data;
};
