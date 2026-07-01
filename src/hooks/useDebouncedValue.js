import { useState, useEffect } from "react";

/**
 * Zwraca wartość opóźnioną o `delay` ms — używane do filtrów tekstowych, by nie
 * strzelać do API na każdą literę przy paginacji po stronie bazy.
 */
export function useDebouncedValue(value, delay = 300) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);

    return debounced;
}