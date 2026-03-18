// src/config/resultEditFields.js
export const resultEditFields = [
    { id: "NrSample", label: "Nr Próbki", type: "text", disabled: true }, // Nie edytujemy numeru
    { id: "StatusSample", label: "Status Próbki", type: "select", options: ["OCZEKUJE", "W TRAKCIE", "ZAKOŃCZONE"] },
    { id: "Comment", label: "Komentarz", type: "text", multiline: true, rows: 3 },
];