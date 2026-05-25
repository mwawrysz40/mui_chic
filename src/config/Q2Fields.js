// src/config/Q2Fields.js
//
// Każde pole może opcjonalnie mieć:
//   col  — szerokość w jednostkach MUI Grid (1–12). Brak = domyślne 4 (czyli 3 kolumny na ekranie md+)
//   row  — numer rzędu (1, 2, 3...). Pola z tym samym row trafiają do tego samego wiersza.
//          Brak = pola układają się kolejno, tak jak dotychczas.
//
// Przykład:
//   { id: "NrSample", col: 4, row: 1 }   → pierwsze pole, rząd 1, szerokość 4/12
//   { id: "Batch",    col: 4, row: 1 }   → drugi pole, ten sam rząd 1
//   { id: "Comments", col: 12, row: 2 }  → osobny rząd 2, pełna szerokość
//
// WAŻNE: col i row są OPCJONALNE. Jeśli żadne pole w zakładce ich nie ma,
// zakładka renderuje się dokładnie tak samo jak przed zmianą.

export const Q2Tabs = [
    {
        id: "general",
        label: "Dane ogólne",
        fields: [
            // Rząd 1 — pola identyfikacyjne (tylko do odczytu)
            { id: "NrSample",   label: "Nr próbki",   type: "text", disabled: true},
            { id: "SampleId",   label: "ID próbki",   type: "text", disabled: true},
            { id: "Batch",      label: "Partia",      type: "text", disabled: true},

            // Rząd 2 — komponent + daty
            { id: "Component",    label: "Komponent",      type: "text", disabled: true},
            { id: "DatePacking",  label: "Data pakowania", type: "date"},

            // Rząd 3 — osoby weryfikujące
            {
                id: "VeryfiPersonSFG", label: "Osoba weryfikująca SFG", type: "select",
                options: [
                    { label: "Anna Wajs",                value: "Anna Wajs" },
                    { label: "Agnieszka Śniadecka",      value: "Agnieszka Śniadecka" },
                    { label: "Ida Cierpka-Okoń",         value: "Ida Cierpka-Okoń" },
                    { label: "Konrelia Prauzińska",      value: "Konrelia Prauzińska" },
                    { label: "Monika Ziąbka",            value: "Monika Ziąbka" },
                    { label: "Zuzanna Aleksandrowicz",   value: "Zuzanna Aleksandrowicz" },
                ],
            },
            {
                id: "VeryfiPersonFG", label: "Osoba weryfikująca FG", type: "select",
                options: [
                    { label: "Anna Wajs",                value: "Anna Wajs" },
                    { label: "Agnieszka Śniadecka",      value: "Agnieszka Śniadecka" },
                    { label: "Ida Cierpka-Okoń",         value: "Ida Cierpka-Okoń" },
                    { label: "Konrelia Prauzińska",      value: "Konrelia Prauzińska" },
                    { label: "Monika Ziąbka",            value: "Monika Ziąbka" },
                    { label: "Zuzanna Aleksandrowicz",   value: "Zuzanna Aleksandrowicz" },
                ],
            },

            // Rząd 4 — status + archiwizacja
            {
                id: "Status", label: "Status", type: "select",
                options: [
                    { label: "ZGODNY",    value: "ZGODNY" },
                    { label: "NIEZGODNY", value: "NIEZGODNY" },
                ],
            },
            {
                id: "ArchiPacking", label: "Opakowanie archiwizacyjne", type: "select",
                options: [
                    { label: "TAK", value: "TAK" },
                    { label: "NIE", value: "NIE" },
                ],
            },

            // Rząd 5 — hibary i partia bazy
            { id: "HibAro",   label: "Hibar aromatu", type: "text"},
            { id: "HibBaz",   label: "Hibar bazy",    type: "text"},
            { id: "BatchBaz", label: "Partia bazy",   type: "text"},

            // Rząd 6 — komentarz na całą szerokość
            { id: "Comments", label: "Komentarz", type: "text"},
        ],
    },
    {
        id: "niko",
        label: "Nikotyna",
        fields: [
            // Rząd 1 — moc + próbki obok siebie
            { id: "NikoM",    label: "Moc nikotyny", type: "number", disabled: true},
            { id: "NikoPR1",  label: "Próbka 1",     type: "number"},
            { id: "NikoPR2",  label: "Próbka 2",     type: "number"},

            // Rząd 2 — wyniki RAG obok siebie
            { id: "NikoRAG1", label: "RAG1", type: "text", disabled: true},
            { id: "NikoRAG2", label: "RAG2", type: "text", disabled: true},
        ],
    },

    // Pozostałe zakładki bez col/row — renderują się jak dotychczas
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
            { id: "DroppR",    label: "R",          type: "number" },
            { id: "DroppA",    label: "A",          type: "number" },
            { id: "DroppG",    label: "G",          type: "number" },
            { id: "DroppDesA", label: "Opis wady A", type: "text" },
            { id: "DroppDesB", label: "Opis wady B", type: "text" },
        ],
    },
    {
        id: "bottle",
        label: "Butelka",
        fields: [
            { id: "BottleR",    label: "R",          type: "number" },
            { id: "BottleA",    label: "A",          type: "number" },
            { id: "BottleG",    label: "G",          type: "number" },
            { id: "BottleDesA", label: "Opis wady A", type: "text" },
            { id: "BottleDesB", label: "Opis wady B", type: "text" },
        ],
    },
    {
        id: "cap",
        label: "Nakrętka",
        fields: [
            { id: "CapR",    label: "R",          type: "number" },
            { id: "CapA",    label: "A",          type: "number" },
            { id: "CapG",    label: "G",          type: "number" },
            { id: "CapDesA", label: "Opis wady A", type: "text" },
            { id: "CapDesB", label: "Opis wady B", type: "text" },
        ],
    },
    {
        id: "label",
        label: "Etykieta",
        fields: [
            { id: "LabelR",    label: "R",          type: "number" },
            { id: "LabelA",    label: "A",          type: "number" },
            { id: "LabelG",    label: "G",          type: "number" },
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
        label: "Płyn",
        fields: [
            { id: "ContamR",   label: "R",      type: "number" },
            { id: "ContamA",   label: "A",      type: "number" },
            { id: "ContamG",   label: "G",      type: "number" },
            { id: "ContamDes", label: "Opis",   type: "text" },
        ],
    },
    {
        id: "mastercase",
        label: "MasterCase",
        fields: [
            { id: "MasterCaseR",    label: "R",          type: "number" },
            { id: "MasterCaseA",    label: "A",          type: "number" },
            { id: "MasterCaseG",    label: "G",          type: "number" },
            { id: "MasterCaseDesA", label: "Opis wady A", type: "text" },
            { id: "MasterCaseDesB", label: "Opis wady B", type: "text" },
        ],
    },
    {
        id: "ctn",
        label: "Opakowanie jednostkowe",
        fields: [
            { id: "CtnR", label: "R", type: "number", col: 1, row: 1  },
            { id: "CtnA", label: "A", type: "number", col: 2, row: 1  },
            { id: "CtnG", label: "G", type: "number" ,col: 3, row: 1 },
            { id: "CtnCatA", label: "Kategoria wady A", type: "select",col: 1, row: 2,  options: [
                    { label: "6.6.1A Nieczytelne napisy",                    value: "6.6.1A Nieczytelne napisy" },
                    { label: "6.6.2A Wady graficzne",                        value: "6.6.2A Wady graficzne" },
                    { label: "6.6.3A Niewłaściwy materiał",                  value: "6.6.3A Niewłaściwy materiał" },
                    { label: "6.6.4A Przesunięta grafika",                   value: "6.6.4A Przesunięta grafika" },
                    { label: "6.6.5A Różnice kolorystyczne",                 value: "6.6.5A Różnice kolorystyczne" },
                    { label: "6.6.6A Niewłaściwe złożenie",                  value: "6.6.6A Niewłaściwe złożenie" },
                    { label: "6.6.7A Uszkodzenia",                           value: "6.6.7A Uszkodzenia" },
                    { label: "6.6.12A Niezabezpieczony produkt",             value: "6.6.12A Niezabezpieczony produkt" },
                    { label: "6.6.13A Niewłaściwe zamknięcie opakowania",    value: "6.6.13A Niewłaściwe zamknięcie opakowania" },
                ] },
            { id: "CtnDesA", label: "Opis wady A", type: "text", col: 1, row: 3  },
            { id: "CtnCatB", label: "Kategoria wady B", type: "select", col: 2, row: 2,  options: [
                    { label: "6.6.2B Wady graficzne",                                        value: "6.6.2B Wady graficzne" },
                    { label: "6.6.4B Przesunięta grafika",                                   value: "6.6.4B Przesunięta grafika" },
                    { label: "6.6.5B Różnice kolorystyczne",                                 value: "6.6.5B Różnice kolorystyczne" },
                    { label: "6.6.7B Uszkodzenia",                                           value: "6.6.7B Uszkodzenia" },
                    { label: "6.6.8B Brak numeru partii i daty",                             value: "6.6.8B Brak numeru partii i daty" },
                    { label: "6.6.9B Nieczytelny numer partii",                              value: "6.6.9B Nieczytelny numer partii" },
                    { label: "6.6.10B Nieczytelny kod kreskowy",                             value: "6.6.10B Nieczytelny kod kreskowy" },
                    { label: "6.6.11B Numer partii nabity poza wyznaczonym obszarem",        value: "6.6.11B Numer partii nabity poza wyznaczonym obszarem" },
                    { label: "6.6.14B Niewłaściwe ułożenie w kartonie",                      value: "6.6.14B Niewłaściwe ułożenie w kartonie" },
                ] },
            { id: "_spacer1", type: "spacer", row: 2 },

            { id: "CtnDesB", label: "Opis wady B", type: "text", col: 2, row: 3  },
            { id: "_spacer2", type: "spacer", row: 3 },
        ],
    },
    {
        id: "srp",
        label: "Opakowanie zbiorcze",
        fields: [
            { id: "SrpR", label: "R", type: "number", col: 1, row: 1  },
            { id: "SrpA", label: "A", type: "number", col: 2, row: 1  },
            { id: "SrpG", label: "G", type: "number", col: 3, row: 1  },
            { id: "SrpCatA", label: "Kategoria wady A", type: "select",col: 1, row: 2, options: [
                    { label: "6.6.1A Nieczytelne napisy",                   value: "6.6.1A Nieczytelne napisy" },
                    { label: "6.6.2A Wady graficzne",                       value: "6.6.2A Wady graficzne" },
                    { label: "6.6.3A Niewłaściwy materiał",                 value: "6.6.3A Niewłaściwy materiał" },
                    { label: "6.6.4A Przesunięta grafika",                  value: "6.6.4A Przesunięta grafika" },
                    { label: "6.6.5A Różnice kolorystyczne",                value: "6.6.5A Różnice kolorystyczne" },
                    { label: "6.6.6A Niewłaściwe złożenie",                 value: "6.6.6A Niewłaściwe złożenie" },
                    { label: "6.6.7A Uszkodzenia",                          value: "6.6.7A Uszkodzenia" },
                    { label: "6.6.12A Niezabezpieczony produkt",            value: "6.6.12A Niezabezpieczony produkt" },
                    { label: "6.6.13A Niewłaściwe zamknięcie opakowania",   value: "6.6.13A Niewłaściwe zamknięcie opakowania" },
                ] },
            { id: "SrpDesA", label: "Opis wady A", type: "text",col: 1, row: 3 },
            { id: "SrpCatB", label: "Kategoria wady B", type: "select",col: 2, row: 2, options: [
                    { label: "6.6.2B Wady graficzne",                                        value: "6.6.2B Wady graficzne" },
                    { label: "6.6.4B Przesunięta grafika",                                   value: "6.6.4B Przesunięta grafika" },
                    { label: "6.6.5B Różnice kolorystyczne",                                 value: "6.6.5B Różnice kolorystyczne" },
                    { label: "6.6.7B Uszkodzenia",                                           value: "6.6.7B Uszkodzenia" },
                    { label: "6.6.8B Brak numeru partii i daty",                             value: "6.6.8B Brak numeru partii i daty" },
                    { label: "6.6.9B Nieczytelny numer partii",                              value: "6.6.9B Nieczytelny numer partii" },
                    { label: "6.6.10B Nieczytelny kod kreskowy",                             value: "6.6.10B Nieczytelny kod kreskowy" },
                    { label: "6.6.11B Numer partii nabity poza wyznaczonym obszarem",        value: "6.6.11B Numer partii nabity poza wyznaczonym obszarem" },
                    { label: "6.6.14B Niewłaściwe ułożenie w kartonie",                      value: "6.6.14B Niewłaściwe ułożenie w kartonie" },
                ] },
            { id: "_spacer3", type: "spacer", row: 2 },
            { id: "SrDesB", label: "Opis wady B", type: "text",col: 2, row: 3 },
            { id: "_spacer4", type: "spacer", row: 3 },
        ],
    },
    {
        id: "tax",
        label: "Banderola",
        fields: [
            { id: "TaxStampR",    label: "R",          type: "number" },
            { id: "TaxStampA",    label: "A",          type: "number" },
            { id: "TaxStampG",    label: "G",          type: "number" },
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
            { id: "GlueYN", label: "tak/nie", type: "select", options: [
                    { label: "TAK", value: "TAK" },
                    { label: "NIE", value: "NIE" },
                ] },
        ],
    },
    {
        id: "leaflet",
        label: "Ulotka",
        fields: [
            { id: "LeafletR",  label: "R",       type: "number" },
            { id: "LeafletA",  label: "A",       type: "number" },
            { id: "LeafletG",  label: "G",       type: "number" },
            { id: "LeafletYN", label: "tak/nie", type: "select", options: [
                    { label: "TAK", value: "TAK" },
                    { label: "NIE", value: "NIE" },
                ] },
        ],
    },
];