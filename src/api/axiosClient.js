import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://fake-api.local", // i tak zmockujemy
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
        const message =
            error.response?.data?.message ||
            error.message ||
            "Wystąpił nieznany błąd";

        return Promise.reject({ message, status: error.response?.status });
    }
);

export default axiosClient;
