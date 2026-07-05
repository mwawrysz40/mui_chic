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
// Te zakładki to pola SZEROKIE z _ESL_Q2 (NikoM/Waga/Wysokość/ogólne).
// 12 komponentów opakowań przeniesiono do modelu instancji — patrz
// Q2ComponentTabs.js (renderowane jako listy instancji z przyciskiem "+").
// Zakładka "Nikotyna" (kind: "niko") łączy oba światy: pola rekordu (fields)
// + lista pomiarów z _ESL_Q2_Niko (instanceFields, tablica nikos[] w payloadzie).

/** Pusta instancja pomiaru nikotyny (kolumny _ESL_Q2_Niko). */
export function emptyNikoInstance() {
    return { PR1: "", PR2: "", RAG1: "", RAG2: "" };
}

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
            // Druga (opcjonalna) osoba weryfikująca FG — ten sam słownik PERSON.
            { id: "VeryfiPersonFG2", label: "Osoba weryfikująca FG 2", type: "select", dictType: "PERSON" },
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
        // Model instancji (_ESL_Q2_Niko): pomiary dodawane przyciskiem "+",
        // renderowane w Q2Modal przez NikoInstances — patrz kind: "niko".
        kind: "niko",
        // Pola rekordu (szerokie, _ESL_Q2 / pochodne) nad listą pomiarów.
        fields: [
            { id: "NikoM",         label: "Moc nikotyny",           type: "number", disabled: true },
            { id: "AccCriterium1", label: "Kryterium akceptacji 1", type: "number", disabled: true },
            { id: "AccCriterium2", label: "Kryterium akceptacji 2", type: "number", disabled: true },

            { id: "PersonWerNik", label: "Osoba weryfikująca wyniki nikotyny", type: "select", dictType: "PERSON" },
            { id: "EvaluationGC", label: "Ocena zgodności wyniku GC",          type: "select", dictType: "STATUS" },
        ],
        // Pola jednej instancji pomiaru (mapowane na kolumny _ESL_Q2_Niko;
        // Avg jest liczona w locie i nie jest zapisywana).
        instanceFields: [
            { id: "PR1",  label: "Próbka 1", type: "number" },
            { id: "PR2",  label: "Próbka 2", type: "number" },
            { id: "RAG1", label: "RAG1",     type: "text",   disabled: true },
            { id: "RAG2", label: "RAG2",     type: "text",   disabled: true },
            { id: "Avg",  label: "Średnia",  type: "number", disabled: true },
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