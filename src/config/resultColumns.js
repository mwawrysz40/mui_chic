// src/config/wynikiColumns.js
export const wynikiColumns = [
    { id: "ID", label: "ID", minWidth: 70, hidden: true },
    { id: "NrSample", label: "Nr Próbki", minWidth: 120, sticky: "left" },
    { id: "Batch", label: "Partia", minWidth: 150 },
    { id: "ItemCode", label: "Indeks", minWidth: 150 },
    { id: "ItemName", label: "Nazwa Produktu", minWidth: 250 },
    { id: "WhsCode", label: "Magazyn SAP", minWidth: 100 },
    // Dane nikotyny (MOC, próbki, średnia, kryteria, oceny zgodności 1/2, wynik GC,
    // osoba weryfikująca) przeniesione do zakładki Nikotyna formularza Q2.
    { id:"EvaluationGC",label:"Ocena zgodności wyniku GC", minWidth: 100, wrap: true },
    { id:"ResultWhs",label:"Wynik sprawdzenia na magazynie", minWidth: 100, wrap: true },
    { id: "StatusSample", label: "Status partii", minWidth: 120 },
    { id: "PersonUnloc", label: "Osoba zwalniająca", minWidth: 100 },
    { id:"DateUnloc", label:"Data odblokowania SAP", minWidth: 100, wrap: true  },
    { id: "Comment", label: "Komentarz", minWidth: 200 },

    {
        id: "createAt",
        label: "Data utworzenia",
        minWidth: 120,
    }
];