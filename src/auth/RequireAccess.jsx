// src/auth/RequireAccess.jsx
// Guard trasy. Wymagane grupy odczytujemy z src/config/navigation.js
// na podstawie aktualnej ścieżki — dzięki temu menu i kontrola dostępu
// nie mogą się rozjechać. Trasa spoza konfiguracji = brak dostępu.
import React from "react";
import { useLocation } from "react-router-dom";
import { useAccess } from "./access";
import { groupsForPath } from "../config/navigation";
import NoAccess from "../components/NoAccess";

export default function RequireAccess({ children }) {
    const { pathname }    = useLocation();
    const { canAccessPath } = useAccess();

    if (!canAccessPath(pathname)) return <NoAccess groups={groupsForPath(pathname)} />;

    return children;
}