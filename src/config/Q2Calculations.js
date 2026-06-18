// src/config/Q2Calculations.js

// Kryteria RAG dla baz (indeksy "PR.BAZ%"): moc liczona ×1,25 (baza zatężona
// przed rozcieńczeniem). Tabela podaje tylko granice odrzutu [MIN, MAX] —
// poza zakresem "R", w zakresie "G" (brak pasma "A").
const BAZ_NIKO_RAG = {
    3:  [3.375, 4.125],
    6:  [6.75, 8.25],
    12: [13.5, 16.5],
    18: [20.25, 24.75],
};

export const calculateNikoRAG = (nikoM, prValue, fieldId, itemCode) => {
    const M = parseFloat(nikoM);
    const val = parseFloat(prValue);

    if (isNaN(M) || isNaN(val)) return "";

    // Indeksy baz (PR.BAZ%) — osobne, zaostrzone granice (tylko MIN/MAX → R/G).
    if (/^PR\.BAZ/i.test(String(itemCode ?? "").trim())) {
        const limits = BAZ_NIKO_RAG[M];
        if (!limits) return "";
        const [min, max] = limits;
        return val < min || val > max ? "R" : "G";
    }

    if (M === 6) {
        if (val > 6.91 || val < 5.1) return "R";
        if (val < 5.3 || val > 6.6) return "A";
        return "G";
    }
    if (M === 18) {
        if (val > 19.8 || val < 16.2) return "R";
        if (val < 17.1 || val > 18.9) return "A";
        return "G";
    }
    if (M === 12) {
        const maxR = (fieldId === "NikoPR2") ? 13.2 : 13.3;
        const minR = (fieldId === "NikoPR2") ? 10.7 : 10.8;
        if (val > maxR || val < minR) return "R";
        if (val > 12.6 || val < 11.4) return "A";
        return "G";
    }
    if (M === 3) {
        if (val > 3.45 || val < 2.55) return "R";
        if (val < 2.7 || val > 3.3) return "A";
        return "G";
    }
    return "";
};

// Mapa kryteriów akceptacji: moc nikotyny → [Acc1, Acc2].
// Przepisana 1:1 z CTE `map` w backend/src/sql/getSampleResult.sql.
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

/**
 * Liczy pola pochodne nikotyny (tylko do odczytu) z surowego rekordu Q2:
 *  - AvgNiko       — średnia z dostępnych próbek NikoPR1/NikoPR2,
 *  - AccCriterium1/2 — kryteria akceptacji wg mocy (NIKO_ACCEPTANCE).
 * Wartości służą tylko do wyświetlenia — nie są zapisywane (poza Q2_COLUMNS).
 */
export const computeNikoDerived = (record) => {
    const vals = [record?.NikoPR1, record?.NikoPR2]
        .map((v) => (v === null || v === undefined || v === "" ? null : parseFloat(v)))
        .filter((v) => v !== null && !isNaN(v));

    const AvgNiko = vals.length
        ? round2(vals.reduce((a, b) => a + b, 0) / vals.length)
        : "";

    const M = parseFloat(record?.NikoM);
    const acc = !isNaN(M) ? NIKO_ACCEPTANCE[round2(M)] : undefined;

    return {
        AvgNiko,
        AccCriterium1: acc ? acc[0] : "",
        AccCriterium2: acc ? acc[1] : "",
    };
};