import { QueryClient } from "@tanstack/react-query";

/**
 * Wspólny klient react-query. Dane są krótko "świeże" (staleTime), więc
 * przełączanie widoków nie generuje natychmiastowych refetchy, ale po mutacji
 * (zapis/usuń/odblokuj) odpowiednie zapytania są unieważniane i pobierane na nowo.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
