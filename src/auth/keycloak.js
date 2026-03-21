// src/auth/keycloak.js
// Pojedyncza instancja Keycloak — importowana w całej aplikacji.
// NIE inicjalizuj jej więcej niż raz.
import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
    url:      import.meta.env.VITE_KEYCLOAK_URL      || 'http://192.168.7.55:8180/',
    realm:    import.meta.env.VITE_KEYCLOAK_REALM    || 'ERP',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT   || 'erp_client',
})

export default keycloak