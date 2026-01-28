// src/config/Q2Validation.js

const COLORS = {
    RED: "#ffcdd2",
    YELLOW: "#fff9c4",
    GREEN: "#c8e6c9",
    WHITE: "transparent"
};

export const getFieldStyle = (fieldId, value) => {
    if (value === "" || value === null || value === undefined) return {};

    // --- 2. SEKCJA: General (Przykład dla Ciebie) ---
    const generalFields = ["Status"];
    if (generalFields.includes(fieldId)) {
        if (value === 'ZGODNY') return { backgroundColor: COLORS.GREEN };
        if (value === 'NIEZGODNY') return { backgroundColor: COLORS.RED };
        return { backgroundColor: COLORS.WHITE };
    }
    const val = parseFloat(value);
    if (isNaN(val)) return {};

    // --- 1. SEKCJA: WAGI ---
    const weightFields = ["WeightPR1", "WeightPR2", "WeightPR3","WeightPR4","WeightPR5"
    ,"WeightPR6","WeightPR7","WeightPR8","WeightPR9","WeightPR10","WeightPR11","WeightPR12","WeightPR13"
        ,"WeightPR14","WeightPR15","WeightPR16","WeightPR17","WeightPR18","WeightPR19","WeightPR20"
    ];
    if (weightFields.includes(fieldId)) {
        if (val >= 71) return { backgroundColor: COLORS.RED };
        if (val > 70 && val < 71) return { backgroundColor: COLORS.YELLOW };
        if (val >= 69.2 && val <= 70) return { backgroundColor: COLORS.GREEN };
        if (val > 68.2 && val < 69.2) return { backgroundColor: COLORS.YELLOW };
        if (val <= 68.2) return { backgroundColor: COLORS.RED };
    }



    // --- 3. SEKCJA: KONTROLA WIZUALNA ---
    // Możesz tu dodawać kolejne warunki...

    return {};
};