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
//
// Te zakładki to pola SZEROKIE z _ESL_Q2 (Niko/Waga/Wysokość/ogólne).
// 12 komponentów opakowań przeniesiono do modelu instancji — patrz
// Q2ComponentTabs.js (renderowane jako listy instancji z przyciskiem "+").

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
            // Uzupełniane automatycznie przy odblokowaniu (imię i nazwisko zalogowanego) — tylko do odczytu.
            { id: "PersonUnloc",     label: "Osoba zwalniająca",      type: "text",   disabled: true },

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

            // Rząd 3 — wartości pochodne (liczone, tylko do odczytu)
            { id: "AvgNiko",       label: "Średnia",                type: "number", disabled: true },
            { id: "AccCriterium1", label: "Kryterium akceptacji 1", type: "number", disabled: true },
            { id: "AccCriterium2", label: "Kryterium akceptacji 2", type: "number", disabled: true },

            // Rząd 4 — weryfikacja GC
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
];
