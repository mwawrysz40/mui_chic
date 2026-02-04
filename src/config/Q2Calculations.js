// src/config/Q2Calculations.js

export const calculateNikoRAG = (nikoM, prValue, fieldId) => {
    const M = parseFloat(nikoM);
    const val = parseFloat(prValue);

    if (isNaN(M) || isNaN(val)) return "";

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