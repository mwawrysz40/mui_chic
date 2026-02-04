// src/config/Q2Validation.js


const COLORS = {
    RED: "#ffcdd2",
    YELLOW: "#fff9c4",
    GREEN: "#c8e6c9",
    WHITE: "transparent"
};

export const getFieldStyle = (fieldId, value, allFormData) => {
    if (!allFormData) return {};
    if (value === "" || value === null || value === undefined) return {};

    // --- SEKCJA: Status ---
    if (fieldId === "Status") {
        if (value === 'ZGODNY') return { backgroundColor: COLORS.GREEN };
        if (value === 'NIEZGODNY') return { backgroundColor: COLORS.RED };
        return { backgroundColor: COLORS.WHITE };
    }

    // --- SEKCJA: NIKOTYNA (Tylko pola RAG) ---
    // Usunęliśmy NikoPR1 i NikoPR2, więc one zawsze będą białe
    if (fieldId === "NikoRAG1" || fieldId === "NikoRAG2") {
        if (value === "R") return { backgroundColor: COLORS.RED };
        if (value === "A") return { backgroundColor: COLORS.YELLOW };
        if (value === "G") return { backgroundColor: COLORS.GREEN };
        return {}; // Jeśli inna wartość, brak koloru
    }

    // Pozostałe pola wymagają konwersji na liczbę
    const val = parseFloat(value);
    if (isNaN(val)) return {};

    // --- SEKCJA: WAGI ---
    const weightFields = [
        "WeightPR1", "WeightPR2", "WeightPR3", "WeightPR4", "WeightPR5",
        "WeightPR6", "WeightPR7", "WeightPR8", "WeightPR9", "WeightPR10",
        "WeightPR11", "WeightPR12", "WeightPR13", "WeightPR14", "WeightPR15",
        "WeightPR16", "WeightPR17", "WeightPR18", "WeightPR19", "WeightPR20"
    ];

    if (weightFields.includes(fieldId)) {
        if (val >= 71) return { backgroundColor: COLORS.RED };
        if (val > 70 && val < 71) return { backgroundColor: COLORS.YELLOW };
        if (val >= 69.2 && val <= 70) return { backgroundColor: COLORS.GREEN };
        if (val > 68.2 && val < 69.2) return { backgroundColor: COLORS.YELLOW };
        if (val <= 68.2) return { backgroundColor: COLORS.RED };
    }

    return {};
};