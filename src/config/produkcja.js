// src/config/produkcja.js
// Pomocnicze dla raportów produkcyjnych (Raport miesięczny, Raport RW, Wykres RW/PW).

const pad = (n) => String(n).padStart(2, "0");
const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Domyślny zakres: od pierwszego dnia bieżącego miesiąca do dziś. */
export function defaultRange() {
    const today = new Date();
    return {
        dateFrom: isoDate(new Date(today.getFullYear(), today.getMonth(), 1)),
        dateTo: isoDate(today),
    };
}

/** Liczby po polsku: 9 995 049,00. */
export function formatNumber(val, digits = 2) {
    const n = typeof val === "number" ? val : Number(val);
    if (!Number.isFinite(n)) return val ?? "-";
    return n.toLocaleString("pl-PL", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}