// src/config/Q2Fields.js
//
// Każde pole może opcjonalnie mieć:
//   col      — szerokość w jednostkach MUI Grid (1–12). Brak = domyślne 4 (czyli 3 kolumny na ekranie md+)
//   row      — numer rzędu (1, 2, 3...). Pola z tym samym row trafiają do tego samego wiersza.
//              Brak = pola układają się kolejno, tak jak dotychczas.
//   dictType — klucz słownika z _ESL_Dictionary (zamiast hardkodowanego options: [...]).
//              Opcje są ładowane przez useDictionary(field.dictType) w Q2Modal.
//
// WAŻNE: col i row są OPCJONALNE. Jeśli żadne pole w zakładce ich nie ma,
// zakładka renderuje się dokładnie tak samo jak przed zmianą.

export const Q2Tabs = [
    {
        id: "general",
        label: "Dane ogólne",
        fields: [
            // Rząd 1 — pola identyfikacyjne (tylko do odczytu)
            { id: "NrSample",   label: "Nr próbki",   type: "text", disabled: true },
            { id: "SampleId",   label: "ID próbki",   type: "text", disabled: true },
            { id: "Batch",      label: "Partia",      type: "text", disabled: true },

            // Rząd 2 — komponent + daty
            { id: "Component",   label: "Komponent",      type: "text", disabled: true },
            { id: "DatePacking", label: "Data pakowania", type: "date" },

            // Rząd 3 — osoby weryfikujące
            { id: "VeryfiPersonSFG", label: "Osoba weryfikująca SFG", type: "select", dictType: "PERSON" },
            { id: "VeryfiPersonFG",  label: "Osoba weryfikująca FG",  type: "select", dictType: "PERSON" },
            { id: "PersonUnloc",     label: "Osoba zwalniająca",      type: "select", dictType: "PERSON" },

            // Rząd 4 — status + archiwizacja
            { id: "Status",       label: "Status",                    type: "select", dictType: "STATUS"  },
            { id: "ArchiPacking", label: "Opakowanie archiwizacyjne", type: "select", dictType: "TAK_NIE" },

            // Rząd 5 — hibary i partia bazy
            { id: "HibAro",   label: "Hibar aromatu", type: "text" },
            { id: "HibBaz",   label: "Hibar bazy",    type: "text" },
            { id: "BatchBaz", label: "Partia bazy",   type: "text" },

            // Rząd 6 — komentarz na całą szerokość
            { id: "Comments", label: "Komentarz", type: "text" },
        ],
    },
    {
        id: "niko",
        label: "Nikotyna",
        fields: [
            // Rząd 1 — moc + próbki obok siebie
            { id: "NikoM",   label: "Moc nikotyny", type: "number", disabled: true },
            { id: "NikoPR1", label: "Próbka 1",     type: "number" },
            { id: "NikoPR2", label: "Próbka 2",     type: "number" },

            // Rząd 2 — wyniki RAG obok siebie
            { id: "NikoRAG1", label: "RAG1", type: "text", disabled: true },
            { id: "NikoRAG2", label: "RAG2", type: "text", disabled: true },

            // Rząd 3 — weryfikacja GC
            { id: "PersonWerNik", label: "Osoba weryfikująca wyniki nikotyny", type: "select", dictType: "PERSON" },
            { id: "EvaluationGC", label: "Ocena zgodności wyniku GC",          type: "select", dictType: "STATUS" },
        ],
    },
    {
        id: "weights",
        label: "Wagi",
        fields: [
            ...Array.from({ length: 20 }).map((_, i) => ({
                id: `WeightPR${i + 1}`,
                label: `Próbka ${i + 1}`,
                type: "number",
            })),
            { id: "WeightR", label: "R", type: "number" },
            { id: "WeightA", label: "A", type: "number" },
            { id: "WeightG", label: "G", type: "number" },
        ],
    },
    {
        id: "heights",
        label: "Wysokość",
        fields: [
            ...Array.from({ length: 20 }).map((_, i) => ({
                id: `HeightPR${i + 1}`,
                label: `Próbka ${i + 1}`,
                type: "number",
            })),
            { id: "HeightR", label: "R", type: "number" },
            { id: "HeightA", label: "A", type: "number" },
            { id: "HeightG", label: "G", type: "number" },
        ],
    },
    {
        id: "dropper",
        label: "Kroplomierz",
        fields: [
            { id: "DroppR",    label: "R", type: "number", col: 1, row: 1 },
            { id: "DroppA",    label: "A", type: "number", col: 2, row: 1 },
            { id: "DroppG",    label: "G", type: "number", col: 3, row: 1 },
            { id: "DroppCatA", label: "Kategoria wady A", type: "select", col: 1, row: 2, dictType: "DEFECT_DROPP_A" },
            { id: "DroppDesA", label: "Opis wady A",      type: "text",   col: 1, row: 3 },
            { id: "DroppCatB", label: "Kategoria wady B", type: "select", col: 2, row: 2, dictType: "DEFECT_DROPP_B" },
            { id: "_spacer1",  type: "spacer", row: 2 },
            { id: "DroppDesB", label: "Opis wady B",      type: "text",   col: 2, row: 3 },
            { id: "_spacer2",  type: "spacer", row: 3 },
        ],
    },
    {
        id: "bottle",
        label: "Butelka",
        fields: [
            { id: "BottleR",    label: "R", type: "number", col: 1, row: 1 },
            { id: "BottleA",    label: "A", type: "number", col: 2, row: 1 },
            { id: "BottleG",    label: "G", type: "number", col: 3, row: 1 },
            { id: "BottleCatA", label: "Kategoria wady A", type: "select", col: 1, row: 2, dictType: "DEFECT_BOTTLE_A" },
            { id: "BottleDesA", label: "Opis wady A",      type: "text",   col: 1, row: 3 },
            { id: "BottleCatB", label: "Kategoria wady B", type: "select", col: 2, row: 2, dictType: "DEFECT_BOTTLE_B" },
            { id: "_spacer3",   type: "spacer", row: 2 },
            { id: "BottleDesB", label: "Opis wady B",      type: "text",   col: 2, row: 3 },
            { id: "_spacer4",   type: "spacer", row: 3 },
        ],
    },
    {
        id: "cap",
        label: "Nakrętka",
        fields: [
            { id: "CapR",    label: "R", type: "number", col: 1, row: 1 },
            { id: "CapA",    label: "A", type: "number", col: 2, row: 1 },
            { id: "CapG",    label: "G", type: "number", col: 3, row: 1 },
            { id: "CapCatA", label: "Kategoria wady A", type: "select", col: 1, row: 2, dictType: "DEFECT_CAP_A" },
            { id: "CapDesA", label: "Opis wady A",      type: "text",   col: 1, row: 3 },
            { id: "CapCatB", label: "Kategoria wady B", type: "select", col: 2, row: 2, dictType: "DEFECT_CAP_B" },
            { id: "_spacer5", type: "spacer", row: 2 },
            { id: "CapDesB", label: "Opis wady B",      type: "text",   col: 2, row: 3 },
            { id: "_spacer6", type: "spacer", row: 3 },
        ],
    },
    {
        id: "label",
        label: "Etykieta",
        fields: [
            { id: "LabelR",    label: "R", type: "number", col: 1, row: 1 },
            { id: "LabelA",    label: "A", type: "number", col: 2, row: 1 },
            { id: "LabelG",    label: "G", type: "number", col: 3, row: 1 },
            { id: "LabelCatA", label: "Kategoria wady A", type: "select", col: 1, row: 2, dictType: "DEFECT_LABEL_A" },
            { id: "LabelDesA", label: "Opis wady A",      type: "text",   col: 1, row: 3 },
            { id: "LabelCatB", label: "Kategoria wady B", type: "select", col: 2, row: 2, dictType: "DEFECT_LABEL_B" },
            { id: "_spacer7",  type: "spacer", row: 2 },
            { id: "LabelDesB", label: "Opis wady B",      type: "text",   col: 2, row: 3 },
            { id: "_spacer8",  type: "spacer", row: 3 },
        ],
    },
    {
        id: "sniffing",
        label: "Zapach",
        fields: [
            { id: "SniffR", label: "R", type: "number" },
            { id: "SniffA", label: "A", type: "number" },
            { id: "SniffG", label: "G", type: "number" },
        ],
    },
    {
        id: "contamination",
        label: "Płyn",
        fields: [
            { id: "ContamR",    label: "R", type: "number", col: 1, row: 1 },
            { id: "ContamA",    label: "A", type: "number", col: 2, row: 1 },
            { id: "ContamG",    label: "G", type: "number", col: 3, row: 1 },
            { id: "ContamCatA", label: "Kategoria wady A", type: "select", col: 1, row: 2, dictType: "DEFECT_CONTAM_A" },
            { id: "ContamDesA", label: "Opis wady A",      type: "text",   col: 1, row: 3 },
            { id: "ContamCatB", label: "Kategoria wady B", type: "select", col: 2, row: 2, dictType: "DEFECT_CONTAM_B" },
            { id: "_spacer9",   type: "spacer", row: 2 },
            { id: "ContamDesB", label: "Opis wady B",      type: "text",   col: 2, row: 3 },
            { id: "_spacer10",  type: "spacer", row: 3 },
        ],
    },
    {
        id: "mastercase",
        label: "MasterCase",
        fields: [
            { id: "MasterCaseR",    label: "R", type: "number", col: 1, row: 1 },
            { id: "MasterCaseA",    label: "A", type: "number", col: 2, row: 1 },
            { id: "MasterCaseG",    label: "G", type: "number", col: 3, row: 1 },
            { id: "MastercaseCatA", label: "Kategoria wady A", type: "select", col: 1, row: 2, dictType: "DEFECT_MCASE_A" },
            { id: "MasterCaseDesA", label: "Opis wady A",      type: "text",   col: 1, row: 3 },
            { id: "MasterCaseCatB", label: "Kategoria wady B", type: "select", col: 2, row: 2, dictType: "DEFECT_MCASE_B" },
            { id: "_spacer11",      type: "spacer", row: 2 },
            { id: "MasterCaseDesB", label: "Opis wady B",      type: "text",   col: 2, row: 3 },
            { id: "_spacer12",      type: "spacer", row: 3 },
        ],
    },
    {
        id: "ctn",
        label: "Opakowanie jednostkowe",
        fields: [
            { id: "CtnR",    label: "R", type: "number", col: 1, row: 1 },
            { id: "CtnA",    label: "A", type: "number", col: 2, row: 1 },
            { id: "CtnG",    label: "G", type: "number", col: 3, row: 1 },
            { id: "CtnCatA", label: "Kategoria wady A", type: "select", col: 1, row: 2, dictType: "DEFECT_CTN_A" },
            { id: "CtnDesA", label: "Opis wady A",      type: "text",   col: 1, row: 3 },
            { id: "CtnCatB", label: "Kategoria wady B", type: "select", col: 2, row: 2, dictType: "DEFECT_CTN_B" },
            { id: "_spacer13", type: "spacer", row: 2 },
            { id: "CtnDesB", label: "Opis wady B",      type: "text",   col: 2, row: 3 },
            { id: "_spacer14", type: "spacer", row: 3 },
        ],
    },
    {
        id: "srp",
        label: "Opakowanie zbiorcze",
        fields: [
            { id: "SrpR",    label: "R", type: "number", col: 1, row: 1 },
            { id: "SrpA",    label: "A", type: "number", col: 2, row: 1 },
            { id: "SrpG",    label: "G", type: "number", col: 3, row: 1 },
            { id: "SrpCatA", label: "Kategoria wady A", type: "select", col: 1, row: 2, dictType: "DEFECT_SRP_A" },
            { id: "SrpDesA", label: "Opis wady A",      type: "text",   col: 1, row: 3 },
            { id: "SrpCatB", label: "Kategoria wady B", type: "select", col: 2, row: 2, dictType: "DEFECT_SRP_B" },
            { id: "_spacer15", type: "spacer", row: 2 },
            { id: "SrDesB",  label: "Opis wady B",      type: "text",   col: 2, row: 3 },
            { id: "_spacer16", type: "spacer", row: 3 },
        ],
    },
    {
        id: "tax",
        label: "Banderola",
        fields: [
            { id: "TaxStampR",    label: "R", type: "number", col: 1, row: 1 },
            { id: "TaxStampA",    label: "A", type: "number", col: 2, row: 1 },
            { id: "TaxStampG",    label: "G", type: "number", col: 3, row: 1 },
            { id: "TaxStampCatA", label: "Kategoria wady A", type: "select", col: 1, row: 2, dictType: "DEFECT_STAMP_A" },
            { id: "TaxStampDesA", label: "Opis wady A",      type: "text",   col: 1, row: 3 },
            { id: "TaxStampCatB", label: "Kategoria wady B", type: "select", col: 2, row: 2, dictType: "DEFECT_STAMP_B" },
            { id: "_spacer17",    type: "spacer", row: 2 },
            { id: "TaxStampDesB", label: "Opis wady B",      type: "text",   col: 2, row: 3 },
            { id: "_spacer18",    type: "spacer", row: 3 },
        ],
    },
    {
        id: "glu",
        label: "Klejenie opakowania",
        fields: [
            { id: "GlueR",  label: "R",       type: "number" },
            { id: "GlueA",  label: "A",       type: "number" },
            { id: "GlueG",  label: "G",       type: "number" },
            { id: "GlueYN", label: "tak/nie", type: "select", dictType: "TAK_NIE" },
        ],
    },
    {
        id: "leaflet",
        label: "Ulotka",
        fields: [
            { id: "LeafletR",    label: "R", type: "number", col: 1, row: 1 },
            { id: "LeafletA",    label: "A", type: "number", col: 2, row: 1 },
            { id: "LeafletG",    label: "G", type: "number", col: 3, row: 1 },
            { id: "LeafletCatA", label: "Kategoria wady A", type: "select", col: 1, row: 2, dictType: "DEFECT_LEAFLET_A" },
            { id: "LeafletDesA", label: "Opis wady A",      type: "text",   col: 1, row: 3 },
            { id: "LeafletCatB", label: "Kategoria wady B", type: "select", col: 2, row: 2, dictType: "DEFECT_LEAFLET_B" },
            { id: "LeafletDesB", label: "Opis wady B",      type: "text",   col: 2, row: 3 },
            { id: "_spacer19",   type: "spacer", row: 2 },
            { id: "LeafletYN",   label: "tak/nie",          type: "select", col: 3, row: 3, dictType: "TAK_NIE" },
        ],
    },
];