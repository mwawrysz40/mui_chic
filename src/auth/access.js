// src/auth/access.js
// Sprawdzanie uprawnień na podstawie grup przychodzących z Keycloak.
//
// Keycloak zwraca grupy jako pełne ścieżki z wiodącym ukośnikiem
// ("/Laboratorium", "/ESL/Akcyza"), dlatego porównujemy tylko ostatni
// segment, bez uwzględniania wielkości liter. Dodatkowo bierzemy pod uwagę
// realm roles — w części realmów grupa jest mapowana na token jako rola.

import { useMemo } from "react";
import { useAuth } from "./AuthProvider";
import { NAV_LEAVES, NAV_SECTIONS, SUPER_GROUP, groupsForPath } from "../config/navigation";

function normalize(name) {
    if (typeof name !== "string") return null;
    const last = name.split("/").filter(Boolean).pop();
    return last ? last.trim().toLowerCase() : null;
}

// Zbiór znormalizowanych nazw grup/ról użytkownika.
export function userGroupSet(user) {
    const raw = [...(user?.groups ?? []), ...(user?.roles ?? [])];
    return new Set(raw.map(normalize).filter(Boolean));
}

// Trasa spoza konfiguracji (`required === null`) jest zamknięta również dla
// Administratora — dzięki temu dodanie trasy bez wpisu w navigation.js
// od razu rzuca się w oczy, zamiast po cichu otwierać stronę.
export function hasAccess(groupSet, required) {
    if (!required) return false;
    if (groupSet.has(normalize(SUPER_GROUP))) return true;
    return required.some((g) => groupSet.has(normalize(g)));
}

// Nazwa grupy do wyświetlenia (bez ścieżki nadrzędnej), np. "/ESL/Akcyza" → "Akcyza".
export function primaryGroupLabel(user) {
    const first = user?.groups?.find((g) => typeof g === "string" && g.trim());
    return first ? first.split("/").filter(Boolean).pop() : null;
}

export function useAccess() {
    const { user } = useAuth();
    const groupSet = useMemo(() => userGroupSet(user), [user]);

    return useMemo(() => {
        const canAccessGroups = (required) => hasAccess(groupSet, required);
        const canAccessPath   = (pathname) => hasAccess(groupSet, groupsForPath(pathname));

        // Sekcje przefiltrowane do tego, co użytkownik ma prawo zobaczyć.
        const sections = NAV_SECTIONS.filter((s) => canAccessGroups(s.groups));

        // Pierwsza dostępna trasa — cel przekierowania, gdy użytkownik
        // nie ma dostępu do Dashboardu.
        const firstPath = NAV_LEAVES.find(
            (leaf) => leaf.path && canAccessGroups(leaf.groups),
        )?.path ?? null;

        return { groupSet, canAccessGroups, canAccessPath, sections, firstPath };
    }, [groupSet]);
}