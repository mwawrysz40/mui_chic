// src/config/resultEditFields.js
export const resultEditFields = [
    { id: "NrSample", label: "Nr Próbki", type: "text", disabled: true },
    {id:"PersonWerNik",
        label:"Osoba weryfikująca wyniki nikotyny",
        type: "select",options: [
            { label: "Anna Wajs", value: "Anna Wajs" },
            { label: "Agnieszka Śniadecka", value: "Agnieszka Śniadecka" },
            { label: "Ida Cierpka-Okoń", value: "Ida Cierpka-Okoń" },
            { label: "Konrelia Prauzińska", value: "Konrelia Prauzińska" },
            { label: "Monika Ziąbka", value: "Monika Ziąbka" },
            { label: "Zuzanna Aleksandrowicz", value: "Zuzanna Aleksandrowicz" }
        ]
    },
    { id:"EvaluationGC",label:"Ocena zgodności wyniku GC", type: "select", options: ["ZGODNY", "NIEZGODNY"]},// Nie edytujemy numeru
    //{ id: "StatusSample", label: "Status Próbki", type: "select", options: ["ZWOLNIONY", "ZABLOKOWANY"] },
    {id:"PersonUnloc",
        label:"Osoba zwalniająca",
        type: "select",options: [
            { label: "Anna Wajs", value: "Anna Wajs" },
            { label: "Agnieszka Śniadecka", value: "Agnieszka Śniadecka" },
            { label: "Ida Cierpka-Okoń", value: "Ida Cierpka-Okoń" },
            { label: "Konrelia Prauzińska", value: "Konrelia Prauzińska" },
            { label: "Monika Ziąbka", value: "Monika Ziąbka" },
            { label: "Zuzanna Aleksandrowicz", value: "Zuzanna Aleksandrowicz" }
        ]
    },
    { id: "Comment", label: "Komentarz", type: "text", multiline: true, rows: 3 },
];