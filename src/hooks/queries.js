import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { fetchSamples } from "../api/sampleService";
import { fetchWynikiProbek } from "../api/getSampleResult";
import { fetchGetCheck, fetchGetDataQ2, fetchWarehouses } from "../api/getCheck";
import { getQ2 } from "../api/getQ2Service";
import {
    updateSample,
    updateResultSample,
    updateQ2,
    unlockResultSample,
} from "../api/updateService";
import { deleteSample } from "../api/deleteSampleService";
import {
    fetchMrpFilters,
    fetchMrpData,
    generateMrp,
    updateMrp,
    createMrpOrder,
} from "../api/mrpService";
import { fetchEwidencje, fetchEwidencjaData } from "../api/ewidencjeService";
import { fetchBanderole, fetchBanderolaData, fetchBanderolaItemCodes } from "../api/banderoleService";
import {
    fetchZleceniaGroups,
    fetchZleceniaData,
    updateZlecenieComment,
} from "../api/productionOrdersService";

/** Centralne klucze zapytań — jedno źródło prawdy dla cache i unieważniania. */
export const queryKeys = {
    samples: ["samples"],
    sampleResults: ["sampleResults"],
    checks: (whsCode = "") => ["checks", whsCode],
    dataQ2: (whsCode = "") => ["dataQ2", whsCode],
    warehouses: ["warehouses"],
    q2: (sampleId) => ["q2", sampleId],
    mrpFilters: ["mrpFilters"],
    mrpData: ["mrpData"],
    ewidencje: ["ewidencje"],
    ewidencjaData: (key, filters) => ["ewidencjaData", key, filters],
    banderole: ["banderole"],
    banderolaData: (key, filters) => ["banderolaData", key, filters],
    banderolaItemCodes: (key) => ["banderolaItemCodes", key],
    zleceniaGroups: ["zleceniaGroups"],
    zleceniaData: (key) => ["zleceniaData", key],
};

// ---------- Zapytania (odczyt) ----------

export function useSamples(params = {}) {
    return useQuery({
        queryKey: [...queryKeys.samples, params],
        queryFn: () => fetchSamples(params),
        placeholderData: keepPreviousData, // płynna zmiana strony/filtra
    });
}

export function useSampleResults(params = {}) {
    return useQuery({
        queryKey: [...queryKeys.sampleResults, params],
        queryFn: () => fetchWynikiProbek(params),
        placeholderData: keepPreviousData,
    });
}

export function useChecks(whsCode = "") {
    return useQuery({
        queryKey: queryKeys.checks(whsCode),
        queryFn: () => fetchGetCheck(whsCode),
        placeholderData: keepPreviousData, // płynna zmiana magazynu bez migotania
    });
}

export function useDataQ2(whsCode = "") {
    return useQuery({
        queryKey: queryKeys.dataQ2(whsCode),
        queryFn: () => fetchGetDataQ2(whsCode),
        placeholderData: keepPreviousData,
    });
}

export function useWarehouses() {
    return useQuery({ queryKey: queryKeys.warehouses, queryFn: fetchWarehouses });
}

export function useQ2(sampleId) {
    return useQuery({
        queryKey: queryKeys.q2(sampleId),
        queryFn: () => getQ2(sampleId),
        enabled: sampleId != null,
    });
}

// ---------- Mutacje (zapis) + unieważnianie ----------

export function useUpdateSample() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateSample,
        onSuccess: () => {
            // NrSample kaskaduje do wyników, więc odświeżamy oba widoki.
            qc.invalidateQueries({ queryKey: queryKeys.samples });
            qc.invalidateQueries({ queryKey: queryKeys.sampleResults });
        },
    });
}

export function useDeleteSample() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteSample,
        onSuccess: () => {
            // Kaskadowe usunięcie obejmuje też wiersze wyników.
            qc.invalidateQueries({ queryKey: queryKeys.samples });
            qc.invalidateQueries({ queryKey: queryKeys.sampleResults });
        },
    });
}

export function useUpdateResultSample() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateResultSample,
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.sampleResults }),
    });
}

export function useUnlockSample() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ batch, person }) => unlockResultSample(batch, person),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.sampleResults }),
    });
}

// ---------- MRP ----------

export function useMrpFilters() {
    return useQuery({ queryKey: queryKeys.mrpFilters, queryFn: fetchMrpFilters });
}

export function useMrpData() {
    return useQuery({ queryKey: queryKeys.mrpData, queryFn: fetchMrpData });
}

export function useGenerateMrp() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: generateMrp,
        // Wynik generowania to nowa zawartość tabeli roboczej — podmieniamy cache.
        onSuccess: (rows) => qc.setQueryData(queryKeys.mrpData, rows),
    });
}

export function useUpdateMrp() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateMrp,
        onSuccess: (_data, { ItemCode, MRP }) => {
            qc.setQueryData(queryKeys.mrpData, (rows) =>
                rows?.map((r) => (r.Indeks === ItemCode ? { ...r, MRP } : r)),
            );
        },
    });
}

export function useCreateMrpOrder() {
    return useMutation({ mutationFn: createMrpOrder });
}

// ---------- Ewidencje akcyzowe ----------

export function useEwidencje() {
    return useQuery({ queryKey: queryKeys.ewidencje, queryFn: fetchEwidencje });
}

export function useEwidencjaData(key, filters, enabled) {
    return useQuery({
        queryKey: queryKeys.ewidencjaData(key, filters),
        queryFn: () => fetchEwidencjaData(key, filters),
        enabled,
    });
}

// ---------- Ewidencja banderol ----------

export function useBanderole() {
    return useQuery({ queryKey: queryKeys.banderole, queryFn: fetchBanderole });
}

/** Kody banderol rejestru zbiorczego — pobierane dopiero po jego wybraniu. */
export function useBanderolaItemCodes(key, enabled) {
    return useQuery({
        queryKey: queryKeys.banderolaItemCodes(key),
        queryFn: () => fetchBanderolaItemCodes(key),
        enabled,
    });
}

export function useBanderolaData(key, filters, enabled) {
    return useQuery({
        queryKey: queryKeys.banderolaData(key, filters),
        queryFn: () => fetchBanderolaData(key, filters),
        enabled,
    });
}

// ---------- Spis zleceń produkcyjnych ----------

export function useZleceniaGroups() {
    return useQuery({ queryKey: queryKeys.zleceniaGroups, queryFn: fetchZleceniaGroups });
}

export function useZleceniaData(key) {
    return useQuery({
        queryKey: queryKeys.zleceniaData(key),
        queryFn: () => fetchZleceniaData(key),
        enabled: Boolean(key),
        placeholderData: keepPreviousData, // płynna zmiana zakładki
    });
}

export function useUpdateZlecenieComment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateZlecenieComment,
        // Klucz komentarza to "<Rodzaj>|<NrDok>" — wpis dotyczy jednej grupy.
        onSuccess: (_data, { Group }) =>
            qc.invalidateQueries({ queryKey: queryKeys.zleceniaData(Group) }),
    });
}

export function useUpdateQ2() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateQ2,
        onSuccess: (_data, variables) => {
            // Q2 wpływa na widok wyników (JOIN), a sam rekord Q2 może być w cache.
            qc.invalidateQueries({ queryKey: queryKeys.sampleResults });
            if (variables?.SampleId != null) {
                qc.invalidateQueries({ queryKey: queryKeys.q2(variables.SampleId) });
            }
        },
    });
}