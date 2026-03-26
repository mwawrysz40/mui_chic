// src/config/statusBadgeConfig.js
//
// Konfiguracja kolorowych badge'y dla wartości w tabeli.
// Żeby dodać nową wartość — wystarczy dodać wpis do obiektu STATUS_COLORS.
//
// Struktura wpisu:
//   'WARTOŚĆ': { color: kolor_tekstu, bg: tło, border: kolor_ramki }
//
// Używane przez: StatusBadge.jsx → ResultTable, SampleTable

export const STATUS_COLORS = {
    // ── Pozytywne ─────────────────────────────────────
    'ZWOLNIONY': {
        color:  '#16a34a',
        bg:     '#f0fdf4',
        border: '#bbf7d0',
    },
    'ZGODNY': {
        color:  '#16a34a',
        bg:     '#f0fdf4',
        border: '#bbf7d0',
    },
    'ZAKOŃCZONE': {
        color:  '#16a34a',
        bg:     '#f0fdf4',
        border: '#bbf7d0',
    },

    // ── Negatywne ──────────────────────────────────────
    'ZABLOKOWANY': {
        color:  '#dc2626',
        bg:     '#fef2f2',
        border: '#fecaca',
    },
    'NIEZGODNY': {
        color:  '#dc2626',
        bg:     '#fef2f2',
        border: '#fecaca',
    },

    // ── Ostrzegawcze ───────────────────────────────────
    'W TRAKCIE': {
        color:  '#b45309',
        bg:     '#fffbeb',
        border: '#fde68a',
    },
    'OCZEKUJE': {
        color:  '#b45309',
        bg:     '#fffbeb',
        border: '#fde68a',
    },
};

// Kolumny w ResultTable które mają renderować badge zamiast zwykłego tekstu.
// Dodaj tu id kolumny z resultColumns.js jeśli chcesz badge dla nowej kolumny.
export const BADGE_COLUMNS_RESULT = new Set([
    'StatusSample',
    'AssCriterium1',
    'AssCriterium2',
    'EvaluationGC',
    'ResultWhs',
]);

// Kolumny w SampleTable które mają renderować badge
export const BADGE_COLUMNS_SAMPLE = new Set([
    'typeResarch',
]);