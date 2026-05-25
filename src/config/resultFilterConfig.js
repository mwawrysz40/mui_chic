// src/config/resultFilterConfig.js
//
// Konfiguracja filtrowania dla tabeli Wyniki Próbek.

export const resultFilterConfig = [
    {
        filterKey: "search",
        match: "includesAny",
        rowKeys: ["NrSample", "ItemName", "ItemCode", "Batch"],
    },
    {
        filterKey: "status",
        rowKey: "StatusSample",
        match: "includes",
    },
    {
        filterKey: "batch",
        rowKey: "Batch",
        match: "includes",
    },
    {
        match: "dateRange",
        rowKey: "createAt",
        fromKey: "dateFrom",
        toKey: "dateTo",
    },
];