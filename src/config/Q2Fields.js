export const Q2Tabs = [
    {
        id: "general",
        label: "Dane ogólne",
        fields: [
            {
                id: "NrSample",
                label: "Nr próbki",
                type: "text",
                disabled: true,
            },
            {
                id: "SampleId",
                label: "ID próbki",
                type: "text",
                disabled: true,
            },
            {
                id: "Batch",
                label: "Partia",
                type: "text",
                disabled: true,
            },
            {
                id: "VeryfiPersonSFG",
                label: "Osoba weryfikująca SFG",
                type: "text",
            },
            {
                id: "VeryfiPersonFG",
                label: "Osoba weryfikująca FG",
                type: "text",
            },
            {
                id: "DatePacking",
                label: "Data pakowania",
                type: "date",
            },
            {
                id: "Comments",
                label: "Komentarz",
                type: "text",
            },
            {
                id: "ArchiPacking",
                label: "Opakowanie archiwizacyjne",
                type: "select",options: [
                    { label: "TAK", value: "TAK" },
                    { label: "NIE", value: "NIE" }
]
            },
            {
                id: "Status",
                label: "Status",
                type: "text",
            },
            {
                id: "HibAro",
                label: "Hibar aromatu",
                type: "text",
            },
            {
                id: "HibBaz",
                label: "Hibar bazy",
                type: "text",
            },
            {
                id: "BatchBaz",
                label: "Partia bazy",
                type: "text",
            },
        ],
    },
    {
        id: "niko",
        label: "Nikotyna",
        fields: [
            { id: "NikoM", label: "Moc nikotyny", type: "number" },
            { id: "NikoPR1", label: "Próbka 1", type: "number" },
            { id: "NikoPR2", label: "Próbka 2", type: "number" },
            { id: "NikoRAG1", label: "RAG1", type: "number" },
            { id: "NikoRAG2", label: "RAG2", type: "number" },
        ],
    },

    {
        id: "weights",
        label: "Wagi",
        fields: [
            // PR1–PR20
            ...Array.from({ length: 20 }).map((_, i) => ({
                id: `WeightPR${i + 1}`,
                label: `Próbka ${i + 1}`,
                type: "number",
            })),

            // pozostałe
            { id: "WeightR", label: "R", type: "number" },
            { id: "WeightA", label: "A", type: "number" },
            { id: "WeightG", label: "G", type: "number" },
        ],
    },
    {
        id: "heights",
        label: "Wysokość",
        fields: [
            // PR1–PR20
            ...Array.from({ length: 20 }).map((_, i) => ({
                id: `HeightPR${i + 1}`,
                label: `Próbka ${i + 1}`,
                type: "number",
            })),

            // pozostałe
            { id: "HeightR", label: "R", type: "number" },
            { id: "HeightA", label: "A", type: "number" },
            { id: "HeightG", label: "G", type: "number" },
        ],
    },
    {
        id: "dropper",
        label: "Kroplomierz",
        fields: [
            { id: "DroppR", label: "R", type: "number" },
            { id: "DroppA", label: "A", type: "number" },
            { id: "DroppG", label: "G", type: "number" },
            { id: "DroppDesA", label: "Opis wady A", type: "text" },
            { id: "DroppDesB", label: "Opis wady B", type: "text" },
        ],
    },
    {
        id: "bottle",
        label: "Butelka",
        fields: [
            { id: "BottleR", label: "R", type: "number" },
            { id: "BottleA", label: "A", type: "number" },
            { id: "BottleG", label: "G", type: "number" },
            { id: "BottleDesA", label: "Opis wady A", type: "text" },
            { id: "BottleDesB", label: "Opis wady B", type: "text" },
        ],
    },
    {
        id: "cap",
        label: "Nakrętka",
        fields: [
            { id: "CapR", label: "R", type: "number" },
            { id: "CapA", label: "A", type: "number" },
            { id: "CapG", label: "G", type: "number" },
            { id: "CapDesA", label: "Opis wady A", type: "text" },
            { id: "CapDesB", label: "Opis wady B", type: "text" },
        ],
    },
    {
        id: "label",
        label: "Etykieta",
        fields: [
            { id: "LabelR", label: "R", type: "number" },
            { id: "LabelA", label: "A", type: "number" },
            { id: "LabelG", label: "G", type: "number" },
            { id: "LabelDesA", label: "Opis wady A", type: "text" },
            { id: "LabelDesB", label: "Opis wady B", type: "text" },
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
        label: "Zanieczyszczenie",
        fields: [
            { id: "ContamR", label: "R", type: "number" },
            { id: "ContamA", label: "A", type: "number" },
            { id: "ContamG", label: "G", type: "number" },
            { id: "ContamDes", label: "Opis", type: "text" },
        ],
    },
    {
        id: "mastercase",
        label: "MasterCase",
        fields: [
            { id: "MasterCaseR", label: "R", type: "number" },
            { id: "MasterCaseA", label: "A", type: "number" },
            { id: "MasterCaseG", label: "G", type: "number" },
            { id: "MasterCaseDesA", label: "Opis wady A", type: "text" },
            { id: "MasterCaseDesB", label: "Opis wady B", type: "text" },
        ],
    },
    {
        id: "ctn",
        label: "Opakowanie jednostkowe",
        fields: [
            { id: "CtnR", label: "R", type: "number" },
            { id: "CtnA", label: "A", type: "number" },
            { id: "CtnG", label: "G", type: "number" },
            { id: "CtnDesA", label: "Opis wady A", type: "text" },
            { id: "CtnDesB", label: "Opis wady B", type: "text" },
        ],
    },
    {
        id: "srp",
        label: "Opakowanie zbiorcze",
        fields: [
            { id: "SrpR", label: "R", type: "number" },
            { id: "SrpA", label: "A", type: "number" },
            { id: "SrpG", label: "G", type: "number" },
            { id: "SrpDesA", label: "Opis wady A", type: "text" },
            { id: "SrpDesB", label: "Opis wady B", type: "text" },
        ],
    },
    {
        id: "tax",
        label: "Banderola",
        fields: [
            { id: "TaxStampR", label: "R", type: "number" },
            { id: "TaxStampA", label: "A", type: "number" },
            { id: "TaxStampG", label: "G", type: "number" },
            { id: "TaxStampDesA", label: "Opis wady A", type: "text" },
            { id: "TaxStampDesB", label: "Opis wady B", type: "text" },
        ],
    },
    {
        id: "glu",
        label: "Klejenie opakowania",
        fields: [
            { id: "GlueR", label: "R", type: "number" },
            { id: "GlueA", label: "A", type: "number" },
            { id: "GlueG", label: "G", type: "number" },
            { id: "GlueYN", label: "tak/nie", type: "select",options: [
                    { label: "TAK", value: "TAK" },
                    { label: "NIE", value: "NIE" }
                ] },
        ],
    },
    {
        id: "leaflet ",
        label: "Ulotka",
        fields: [
            { id: "LeafletR", label: "R", type: "number" },
            { id: "LeafletA", label: "A", type: "number" },
            { id: "LeafletG", label: "G", type: "number" },
            {
                id: "LeafletYN",
                label: "tak/nie",
                type: "select",
                options: [
                    { label: "TAK", value: "TAK" },
                    { label: "NIE", value: "NIE" }
                ]
            }
        ],
    },
];
