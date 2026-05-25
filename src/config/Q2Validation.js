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

    // --- SEKCJA: wysokość ---
    const heightFields = [
        "HeightPR1", "HeightPR2", "HeightPR3", "HeightPR4", "HeightPR5",
        "HeightPR6", "HeightPR7", "HeightPR8", "HeightPR9", "HeightPR10",
        "HeightPR11", "HeightPR12", "HeightPR13", "HeightPR14", "HeightPR15",
        "HeightPR16", "HeightPR17", "HeightPR18", "HeightPR19", "HeightPR20"
    ];

    if (heightFields.includes(fieldId)) {
        if (val > 72) return { backgroundColor: COLORS.RED };
        if (val > 70 && val <= 72) return { backgroundColor: COLORS.YELLOW };
        if (val >= 69.2 && val <= 70) return { backgroundColor: COLORS.GREEN };
        if (val > 68.2 && val < 69.2) return { backgroundColor: COLORS.YELLOW };
        if (val <= 68.2) return { backgroundColor: COLORS.RED };
    }
    // --- SEKCJA: waga ---
    const weightFields = [
        "WeightPR1", "WeightPR2", "WeightPR3", "WeightPR4", "WeightPR5",
        "WeightPR6", "WeightPR7", "WeightPR8", "WeightPR9", "WeightPR10",
        "WeightPR11", "WeightPR12", "WeightPR13", "WeightPR14", "WeightPR15",
        "WeightPR16", "WeightPR17", "WeightPR18", "WeightPR19", "WeightPR20"
    ];

    if (weightFields.includes(fieldId)) {
        if (val >= 18.3) return { backgroundColor: COLORS.RED };
        if (val >= 18.21 && val <= 18.5) return { backgroundColor: COLORS.YELLOW };
        if (val >= 17.8 && val <= 18.2) return { backgroundColor: COLORS.GREEN };
        if (val >= 17.5 && val <= 17.79) return { backgroundColor: COLORS.YELLOW };
        if (val <= 17.5) return { backgroundColor: COLORS.RED };
    }

    return {};
};