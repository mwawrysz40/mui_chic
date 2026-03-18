// src/config/sampleFilterConfig.js
//
// Konfiguracja filtrowania dla tabeli Próbki.
// Żeby dodać nowe pole filtra — wystarczy dodać wpis do tej tablicy.
// Żeby usunąć — wystarczy usunąć lub zakomentować wpis.
//
// Typy dopasowania (match):
//   "includes"  — czy pole zawiera wpisany tekst (case-insensitive)
//   "exact"     — czy pole jest dokładnie równe wartości (np. select)
//
// filterKey  — nazwa klucza w obiekcie filtrów (ze stanu w Probki.jsx)
// rowKey     — nazwa pola w obiekcie wiersza danych z API

export const sampleFilterConfig = [
    {
        filterKey: "search",
        match: "includesAny",
        // includesAny sprawdza tekst we wszystkich polach wiersza
        // rowKey nie jest potrzebny — szukamy po wszystkich wartościach
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
        filterKey: "type",
        rowKey: "itemCode",
        match: "includes",
    },
    {
        filterKey: "create",
        rowKey: "createAt",
        match: "exact",
    },
];