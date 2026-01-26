export async function getSamples() {
    // symulacja opóźnienia
    await new Promise((res) => setTimeout(res, 1500));

    const shouldFail = Math.random() < 0.5; // 50% szansy na błąd

    if (shouldFail) {
        // symulowany błąd
        return Promise.reject({
            message: "Błąd połączenia z API (test).",
            status: 500,
        });
    }

    // symulowane poprawne dane
    return {
        data: [
            { id: 1, name: "Próbka A", type: "Typ 1", status: "Aktywna", owner: "Jan", date: "2024-01-01" },
            { id: 2, name: "Próbka B", type: "Typ 2", status: "Archiwalna", owner: "Anna", date: "2024-01-02" },
            { id: 3, name: "Próbka C", type: "Typ 3", status: "Aktywna", owner: "Marek", date: "2024-01-03" }
        ]
    };
}
