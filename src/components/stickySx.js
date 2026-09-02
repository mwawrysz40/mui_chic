// src/components/stickySx.js

/**
 * Style sticky komórek tabel serwerowych (Próbki/Wyniki): pierwsza kolumna
 * i kolumny z `col.sticky` przyklejone poziomo, nagłówek pionowo.
 */
export function getStickySx(col, index, isHeader) {
    const isHorizontalSticky = index === 0 || Boolean(col.sticky);

    return {
        minWidth:        col.minWidth,
        position:        (isHorizontalSticky || isHeader) ? "sticky" : "static",
        left:            (index === 0 || col.sticky === "left") ? 0 : undefined,
        right:           col.sticky === "right" ? 0 : undefined,
        top:             isHeader ? 0 : undefined,
        zIndex:          isHeader
            ? (isHorizontalSticky ? 4 : 3)
            : (isHorizontalSticky ? 2 : 1),
        whiteSpace:      (isHeader && col.wrap) ? "normal" : "nowrap",
        lineHeight:      (isHeader && col.wrap) ? 1.3 : undefined,
        verticalAlign:   isHeader ? "bottom" : "middle",
        backgroundColor: isHeader ? "#faf9ff" : (isHorizontalSticky ? "#ffffff" : undefined),
    };
}

/**
 * Prekalkulacja stylów dla stałej listy kolumn — liczone raz na moduł zamiast
 * przy każdym renderze komórki.
 */
export const buildStickySx = (cols) => ({
    head: cols.map((col, i) => getStickySx(col, i, true)),
    cell: cols.map((col, i) => getStickySx(col, i, false)),
});
