// src/config/resultFilterConfig.js
//
// Konfiguracja filtrowania dla tabeli Wyniki Próbek.
// Żeby dodać nowe pole filtra — wystarczy dodać wpis do tej tablicy.
// Żeby usunąć — wystarczy usunąć lub zakomentować wpis.

export const resultFilterConfig = [
    {
        filterKey: "search",
        match: "includesAny",
        // Szuka tekstu po polach NrSample i ItemName
        rowKeys: ["NrSample", "ItemName"],
    },
    {
        filterKey: "status",
        rowKey: "StatusSample",
        match: "exact",
    },
    {
        filterKey: "batch",
        rowKey: "Batch",
        match: "includes",
    },
];