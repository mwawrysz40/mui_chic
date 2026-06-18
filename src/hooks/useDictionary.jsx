import { createContext, useContext, useEffect, useState } from "react";
import { getDictionary } from "../api/dictionaryService";

const DictionaryContext = createContext({});

export function DictionaryProvider({ children }) {
    const [dict, setDict] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getDictionary()
            .then(setDict)
            .catch((err) => {
                console.error("Błąd ładowania słownika:", err);
                setError(err);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <DictionaryContext.Provider value={{ dict, loading, error }}>
            {children}
        </DictionaryContext.Provider>
    );
}

/**
 * Dwa tryby użycia:
 *
 * useDictionary("PERSON")  → tablica [{label, value}, ...] dla danego typu.
 *                             Zwraca [] gdy typ nie istnieje lub słownik się ładuje.
 *
 * useDictionary()          → cały obiekt dict { PERSON: [...], ... }.
 *                             Używaj gdy potrzebujesz wielu typów naraz (np. w mapie pól).
 */
// eslint-disable-next-line react-refresh/only-export-components -- provider + hook celowo w jednym pliku (jak AuthProvider)
export function useDictionary(type) {
    const { dict } = useContext(DictionaryContext);
    if (type === undefined) return dict;   // cały słownik (dla komponentów z wieloma typami)
    return dict[type] ?? [];               // konkretny typ — zawsze tablica
}
