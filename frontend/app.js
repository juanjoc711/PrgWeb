import { register, login } from "./auth.js";
import { changeUsername, changePassword } from "./account.js"; 
import { fetchAssociations, fetchMyAssociations, createAssociation } from "./associations.js";
import { switchView, setToken } from "./utils.js"; 



document.getElementById("go-to-register").addEventListener("click", () => {
  switchView("register");
});

document.getElementById("go-to-login").addEventListener("click", () => {
  switchView("login");
});

document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;
  register(username, password);
});

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  login(username, password, () => {
    switchView("associations-view");
    document.getElementById("create-button-container").style.display = "block";
    fetchAssociations();
  });
});

// Crear asociación
document.getElementById("create-button").addEventListener("click", () => {
  const name = prompt("Introduce el nombre de la asociación:");
  const description = prompt("Introduce una descripción para la asociación:");
  if (name && description) {
    createAssociation(name, description);
  } else {
    alert("Por favor, completa todos los campos.");
  }
});

// Botón de administración personal
document.getElementById("admin-button").addEventListener("click", () => {
  switchView("account-management");
});
// Mostrar/ocultar el menú desplegable
document.getElementById("user-icon").addEventListener("click", () => {
  const dropdown = document.getElementById("user-dropdown");
  dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
});
// Botón de "Administración de cuenta"
document.getElementById("admin-button").addEventListener("click", () => {
  switchView("account-management");
});

// Cambiar Nombre de Usuario
document.getElementById("change-username-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const newUsername = document.getElementById("new-username").value;
  await changeUsername(newUsername);
});

// Cambiar Contraseña
document.getElementById("change-password-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const currentPassword = document.getElementById("current-password").value;
  const newPassword = document.getElementById("new-password").value;
  await changePassword(currentPassword, newPassword);
});

// Botón "Volver" en la administración de cuenta
document.getElementById("back-to-main").addEventListener("click", () => {
  switchView("associations-view");
});

// Cerrar sesión
document.getElementById("logout-button").addEventListener("click", () => {
  setToken(""); // Aquí se asegura de que el token se limpie globalmente
  switchView("login");
});

document.getElementById("my-associations-button").addEventListener("click", () => {
  fetchMyAssociations(); // Asegúrate de que esta función esté bien definida
  switchView("my-associations-view"); // Cambia a una vista específica para "Mis Asociaciones"
});
