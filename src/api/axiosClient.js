import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
});

// REQUEST interceptor (np. dodanie tokena z Keycloak)
axiosClient.interceptors.request.use(
    (config) => {
        // config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE interceptor
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // API zwraca błędy w kształcie { error: { code, message: { value } } }.
        // Sięgamy najpierw po tę zagnieżdżoną wartość, a dopiero potem po fallbacki.
        const data = error.response?.data;
        const message =
            data?.error?.message?.value ||
            data?.message ||
            error.message ||
            "Wystąpił nieznany błąd";

        return Promise.reject({ message, status: error.response?.status });
    }
);

export default axiosClient;
