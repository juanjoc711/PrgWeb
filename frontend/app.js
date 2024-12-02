import { register, login } from "./auth/auth.js";
import { changeUsername, changePassword } from "./components/account/account.js"; 
import { fetchAssociations, fetchMyAssociations, createAssociation, searchAssociations } from "./components/associations/associations.js";
import { renderMyAssociationsTable} from "./components/associations/renderMyAssociationsTable.js";
import { switchView, setToken, getUserId, getUserRole } from "./utils/utils.js"; 




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

document.getElementById("my-associations-button").addEventListener("click", async () => {
  const userId = getUserId(); // Obtiene el ID del usuario
  const userRole = getUserRole(); // Obtiene el rol del usuario
  const associations = await fetchMyAssociations(false); // Obtiene las asociaciones
  renderMyAssociationsTable(associations, userId, userRole); // Renderiza la tabla
  switchView("my-associations-view");
});


document.getElementById("back-to-associations").addEventListener("click", () => {
  switchView("associations-view"); // Cambia a la vista de asociaciones principales
});

document.getElementById("search-bar").addEventListener("input", (e) => {
  const query = e.target.value.trim();
  if (query) {
      searchAssociations(query);
  } else {
      fetchAssociations(); // Mostrar todas las asociaciones si el campo está vacío
  }
});

document.getElementById("back-to-associations-details").addEventListener("click", () => {
  switchView("associations-view"); // Cambia a la vista principal de asociaciones
});

