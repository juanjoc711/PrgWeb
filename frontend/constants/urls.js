const BASE_URL = "http://localhost:3000";

export const AUTH_URLS = {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    CHANGE_USERNAME: `${BASE_URL}/auth/change-username`,
    CHANGE_PASSWORD: `${BASE_URL}/auth/change-password`,
};

export const ASSOCIATION_URLS = {
    LIST: `${BASE_URL}/associations`,
    CREATE: `${BASE_URL}/associations`,
    UPDATE: (id) => `${BASE_URL}/associations/${id}`,
    DELETE: (id) => `${BASE_URL}/associations/${id}`,
    USER_ASSOCIATIONS: `${BASE_URL}/user/associations`,
};
