// src/config/resultEditFields.js

export const resultEditFields = [
    { id: "NrSample",      label: "Nr Próbki",                          type: "text",   disabled: true },
    { id: "PersonWerNik",  label: "Osoba weryfikująca wyniki nikotyny", type: "select", dictType: "PERSON" },
    { id: "EvaluationGC",  label: "Ocena zgodności wyniku GC",          type: "select", dictType: "STATUS" },
    { id: "PersonUnloc",   label: "Osoba zwalniająca",                  type: "select", dictType: "PERSON" },
    { id: "Comment",       label: "Komentarz",                          type: "text",   multiline: true, rows: 3 },
];