// src/config/Q2Calculations.js
//
// JEDYNE źródło progów nikotyny w aplikacji. Backend na tym branchu nie ma
// własnej mapy tolerancji — GetSampleResult liczy status z zapisanych ocen,
// a wartości RAG wylicza i zapisuje frontend (Q2Modal). Pasma RAG poniżej są
// wyliczane z NIKO_ACCEPTANCE albo jawnie na nią wskazują — nie duplikuj ich.

// Mapa kryteriów akceptacji: moc/stężenie nikotyny → [Acc1, Acc2]
// (granice czerwone, ±10 % od wartości nominalnej).
export const NIKO_ACCEPTANCE = {
    22.5:  [20.25, 24.75],
    18:    [16.2, 19.8],
    15:    [13.5, 16.5],
    12:    [10.8, 13.2],
    11.25: [10.125, 12.375],
    9:     [7.65, 10.35],
    11:    [8.8, 13.2],
    7.5:   [6.75, 8.25],
    6:     [5.1, 6.9],
    3:     [2.55, 3.45],
    3.75:  [3.375, 4.125],
    0:     [0, 0],
};

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

// Kryteria RAG dla baz (indeksy "PR.BAZ%"). Klucz = stężenie bazy (NikoM w
// bazie danych — baza zatężona ×1,25 względem mocy rozcieńczonej). Pasma wg
// pliku "nikotyna": R poza ±10 % (granice = NIKO_ACCEPTANCE), A między ±5 %
// a ±10 %, G w paśmie ±5 %. Format: [redMin, greenMin, greenMax, redMax].
const BAZ_STRENGTHS = [3.75, 7.5, 11.25, 15, 22.5];
const BAZ_NIKO_RAG = Object.fromEntries(
    BAZ_STRENGTHS.map((m) => {
        const [redMin, redMax] = NIKO_ACCEPTANCE[m];
        return [m, [redMin, round2(m * 0.95), round2(m * 1.05), redMax]];
    }),
);

// Pasma RAG liquidów wg mocy: `r` = granice czerwone, `g` = pasmo zielone
// (pomiędzy nimi A). Granice R są historyczne i NIE zawsze równe
// NIKO_ACCEPTANCE (6 → R dopiero powyżej 6.91; 12 → PR1 10.8–13.3, a PR2
// 10.7–13.2, stąd nadpisanie rPR2), dlatego jawna tabela zamiast wyliczenia.
const LIQUID_NIKO_RAG = {
    3:  { r: [2.55, 3.45], g: [2.7, 3.3] },
    6:  { r: [5.1, 6.91], g: [5.3, 6.6] },
    12: { r: [10.8, 13.3], rPR2: [10.7, 13.2], g: [11.4, 12.6] },
    18: { r: [16.2, 19.8], g: [17.1, 18.9] },
};

export const calculateNikoRAG = (nikoM, prValue, fieldId, itemCode) => {
    const M = parseFloat(nikoM);
    const val = parseFloat(prValue);

    if (isNaN(M) || isNaN(val)) return "";

    // Indeksy baz (PR.BAZ%) — osobne pasma wg stężenia bazy. Jeśli NikoM podano
    // jako moc rozcieńczoną (3/6/9/12/18), przeliczamy ×1,25 na stężenie bazy.
    if (/^PR\.BAZ/i.test(String(itemCode ?? "").trim())) {
        const limits = BAZ_NIKO_RAG[M] ?? BAZ_NIKO_RAG[round2(M * 1.25)];
        if (!limits) return "";
        const [redMin, greenMin, greenMax, redMax] = limits;
        if (val < redMin || val > redMax) return "R";
        if (val < greenMin || val > greenMax) return "A";
        return "G";
    }

    const bands = LIQUID_NIKO_RAG[M];
    if (!bands) return "";
    const [redMin, redMax] = (fieldId === "NikoPR2" && bands.rPR2) || bands.r;
    const [greenMin, greenMax] = bands.g;
    if (val < redMin || val > redMax) return "R";
    if (val < greenMin || val > greenMax) return "A";
    return "G";
};

/**
 * Liczy pola pochodne nikotyny (tylko do odczytu) z surowego rekordu Q2:
 *  - AccCriterium1/2 — kryteria akceptacji wg mocy (NIKO_ACCEPTANCE).
 * Wartości służą tylko do wyświetlenia — nie są zapisywane (poza Q2_COLUMNS).
 * Średnia z próbek jest liczona per pomiar — patrz computeNikoInstanceAvg.
 */
export const computeNikoDerived = (record) => {
    const M = parseFloat(record?.NikoM);
    const acc = !isNaN(M) ? NIKO_ACCEPTANCE[round2(M)] : undefined;

    return {
        AccCriterium1: acc ? acc[0] : "",
        AccCriterium2: acc ? acc[1] : "",
    };
};

/**
 * Średnia z dostępnych próbek PR1/PR2 jednej instancji pomiaru nikotyny
 * (_ESL_Q2_Niko). Liczona w locie do wyświetlenia — nie jest zapisywana.
 */
export const computeNikoInstanceAvg = (instance) => {
    const vals = [instance?.PR1, instance?.PR2]
        .map((v) => (v === null || v === undefined || v === "" ? null : parseFloat(v)))
        .filter((v) => v !== null && !isNaN(v));

    return vals.length
        ? round2(vals.reduce((a, b) => a + b, 0) / vals.length)
        : "";
};
