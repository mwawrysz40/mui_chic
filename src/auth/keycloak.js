// src/auth/keycloak.js
// Pojedyncza instancja Keycloak — importowana w całej aplikacji.
// NIE inicjalizuj jej więcej niż raz.
import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
    url:      import.meta.env.VITE_KEYCLOAK_URL,
    realm:    import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT
})

export default keycloak