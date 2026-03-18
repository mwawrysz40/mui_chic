// src/config/resultEditFields.js
export const resultEditFields = [
    { id: "NrSample", label: "Nr Próbki", type: "text", disabled: true },
    {id:"PersonWerNik", label:"Osoba weryfikująca wyniki nikotyny",type:"text"},
    { id:"EvaluationGC",label:"Ocena zgodności wyniku GC", type: "select", options: ["ZGODNY", "NIEZGODNY"]},// Nie edytujemy numeru
    { id: "StatusSample", label: "Status Próbki", type: "select", options: ["ZWOLNIONY", "ZABLOKOWANY"] },
    {id:"PersonUnloc",label:"Osoba zwalniająca",type:"text"},
    { id: "Comment", label: "Komentarz", type: "text", multiline: true, rows: 3 },
];