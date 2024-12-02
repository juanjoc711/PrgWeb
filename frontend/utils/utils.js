
let token = "";

export function setToken(newToken) {
    token = newToken;
}

export function getToken() {
    return token;
}

export function switchView(viewId) {
    const views = ["login", "register", "associations-view", "account-management", "my-associations-view", "association-details-view"];
    views.forEach((id) => {
        document.getElementById(id).style.display = id === viewId ? "block" : "none";
    });
}

export function getUserId() {
    const token = getToken();
    if (!token) return null;
    const decoded = window.jwt_decode(token); // Usa la función global del CDN
    return decoded.id;
}

export function getUserRole() {
    const token = getToken();
    if (!token) return null;
    const decoded = window.jwt_decode(token); // Usa la función global del CDN
    return decoded.role;
}
