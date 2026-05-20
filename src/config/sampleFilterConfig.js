// src/config/sampleFilterConfig.js
//
// Konfiguracja filtrowania dla tabeli Próbki.
//
// Typy dopasowania (match):
//   "includes"   — czy pole zawiera wpisany tekst (case-insensitive)
//   "exact"      — czy pole jest dokładnie równe wartości (np. select)
//   "dateRange"  — filtrowanie po zakresie dat (fromKey / toKey w filters)
//
// filterKey  — nazwa klucza w obiekcie filtrów (ze stanu w Probki.jsx)
// rowKey     — nazwa pola w obiekcie wiersza danych z API

export const sampleFilterConfig = [
    {
        filterKey: "search",
        match: "includesAny",
        // Szukamy tylko po kluczowych polach — NIE po Object.values(row),
        // bo to bottleneck przy duzych tabelach (kazdy wiersz x kazde pole).
        rowKeys: ["sampleNumber", "itemName", "itemCode", "batch", "person", "numberOrder"],
    },
    {
        filterKey: "status",
        rowKey: "typeResarch",
        match: "exact",
    },
    {
        filterKey: "owner",
        rowKey: "person",
        match: "exact",
    },
    {
        filterKey: "batch",
        rowKey: "batch",
        match: "includes",
    },
    {
        // Filtr zakresu dat — uzywa createFrom i createTo z filters
        match: "dateRange",
        rowKey: "createAt",
        fromKey: "createFrom",
        toKey: "createTo",
    },
];