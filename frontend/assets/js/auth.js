import { AUTH_URLS } from '../../constants/urls.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/messages.js';

// Manejo de login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(AUTH_URLS.LOGIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            alert(ERROR_MESSAGES.LOGIN_FAILED);
            return;
        }

        const data = await response.json();
        localStorage.setItem("token", data.token); // Guardar token en localStorage
        alert(SUCCESS_MESSAGES.LOGIN_SUCCESS);
        window.location.href = "./general.html"; // Redirigir a vista general
    } catch (error) {
        console.error(error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
});

// Manejo de registro
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    try {
        const response = await fetch(AUTH_URLS.REGISTER, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            alert(ERROR_MESSAGES.REGISTER_FAILED);
            return;
        }

        alert(SUCCESS_MESSAGES.REGISTER_SUCCESS);
        document.getElementById("registerForm").reset();
        const bootstrapModal = bootstrap.Modal.getInstance(
            document.getElementById("registerModal")
        );
        bootstrapModal.hide(); // Cerrar modal tras éxito
    } catch (error) {
        console.error(error);
        alert(ERROR_MESSAGES.FETCH_ERROR);
    }
});
