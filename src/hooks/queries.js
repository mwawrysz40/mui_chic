import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSamples } from "../api/sampleService";
import { fetchWynikiProbek } from "../api/getSampleResult";
import { fetchGetCheck, fetchGetDataQ2 } from "../api/getCheck";
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

/** Centralne klucze zapytań — jedno źródło prawdy dla cache i unieważniania. */
export const queryKeys = {
    samples: ["samples"],
    sampleResults: ["sampleResults"],
    checks: ["checks"],
    dataQ2: ["dataQ2"],
    q2: (sampleId) => ["q2", sampleId],
    mrpFilters: ["mrpFilters"],
    mrpData: ["mrpData"],
    ewidencje: ["ewidencje"],
    ewidencjaData: (key, filters) => ["ewidencjaData", key, filters],
};

// ---------- Zapytania (odczyt) ----------

export function useSamples() {
    return useQuery({ queryKey: queryKeys.samples, queryFn: fetchSamples });
}

export function useSampleResults() {
    return useQuery({ queryKey: queryKeys.sampleResults, queryFn: fetchWynikiProbek });
}

export function useChecks() {
    return useQuery({ queryKey: queryKeys.checks, queryFn: fetchGetCheck });
}

export function useDataQ2() {
    return useQuery({ queryKey: queryKeys.dataQ2, queryFn: fetchGetDataQ2 });
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
