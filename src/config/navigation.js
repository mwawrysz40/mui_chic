// src/config/navigation.js
// Jedyne źródło prawdy dla nawigacji i uprawnień do stron.
// Sidebar renderuje sekcje stąd, a App.jsx pilnuje dostępu do tras
// na podstawie tych samych definicji (patrz groupsForPath).

import DashboardIcon from "@mui/icons-material/Dashboard";
import ScienceIcon from "@mui/icons-material/Science";
import BiotechIcon from "@mui/icons-material/Biotech";
import AssessmentIcon from "@mui/icons-material/Assessment";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

// Nazwy grup Keycloak. Porównywane bez uwzględniania wielkości liter
// i bez ścieżki nadrzędnej (patrz src/auth/access.js).
export const GROUPS = {
    ADMINISTRATOR: "Administrator",
    LABORATORIUM:  "Laboratorium",
    AKCYZA:        "Akcyza",
    ADMINISTRACJA: "Administracja",
};

// Grupa z dostępem do wszystkiego — nie trzeba jej wypisywać w sekcjach.
export const SUPER_GROUP = GROUPS.ADMINISTRATOR;

// Struktura: sekcja → pozycje → (opcjonalnie) pozycje podrzędne.
// `groups` na sekcji obowiązuje wszystkie jej pozycje.
// `paths` wymienia wszystkie trasy pozycji, gdy jest ich więcej niż jedna
// (`path` to cel kliknięcia w menu).
export const NAV_SECTIONS = [
    {
        id:     "glowne",
        label:  "Główne",
        groups: [GROUPS.LABORATORIUM],
        items: [
            {
                id:    "dashboard",
                label: "Dashboard",
                path:  "/",
                paths: ["/", "/dashboard/checks"],
                icon:  DashboardIcon,
            },
        ],
    },
    {
        id:     "laboratorium",
        label:  "Laboratorium",
        groups: [GROUPS.LABORATORIUM],
        items: [
            {
                id:    "probki-wyniki",
                label: "Próbki i Wyniki",
                icon:  BiotechIcon,
                children: [
                    { id: "probki", label: "Próbki",        path: "/probki", icon: ScienceIcon },
                    { id: "wyniki", label: "Wyniki Analiz", path: "/wyniki", icon: AssessmentIcon },
                ],
            },
        ],
    },
    {
        id:     "akcyza",
        label:  "Akcyza",
        groups: [GROUPS.AKCYZA],
        items: [
            {
                id:    "ewidencje",
                label: "Ewidencje akcyzowe",
                path:  "/ewidencje",
                icon:  ReceiptLongIcon,
            },
        ],
    },
    {
        id:     "administracja",
        label:  "Administracja",
        groups: [GROUPS.ADMINISTRACJA],
        items: [
            {
                id:    "mrp",
                label: "MRP",
                path:  "/mrp",
                icon:  InventoryIcon,
            },
        ],
    },
];

// Wszystkie trasy danej pozycji menu (pozycja nadrzędna bez `path` ich nie ma).
const itemPaths = (item) => item.paths ?? (item.path ? [item.path] : []);

// Spłaszczona lista pozycji z trasami — używana przez guardy i sidebar.
export const NAV_LEAVES = NAV_SECTIONS.flatMap((section) =>
    section.items.flatMap((item) =>
        (item.children ?? [item]).map((leaf) => ({
            ...leaf,
            sectionId: section.id,
            groups:    section.groups,
            paths:     itemPaths(leaf),
        })),
    ),
);

// Grupy wymagane dla trasy. `null` = trasa nieznana (brak reguły).
export function groupsForPath(pathname) {
    const leaf = NAV_LEAVES.find((l) => l.paths.includes(pathname));
    return leaf ? leaf.groups : null;
}