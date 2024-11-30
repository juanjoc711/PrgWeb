const baseUrl = "http://localhost:3000"; 

// Variables globales
let token = "";

// Login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      token = data.token;

      alert("Login exitoso");

      document.getElementById("login").style.display = "none";
      document.getElementById("create-association").style.display = "block";
      document.getElementById("list-associations").style.display = "block";

      fetchAssociations();
    } else {
      document.getElementById("login-error").style.display = "block";
      document.getElementById("login-error").innerText = "Usuario o contraseña incorrectos";
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Hubo un problema al conectarse con el servidor.");
  }
});

// Crear Asociación
document.getElementById("create-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("association-name").value;
  const description = document.getElementById("association-description").value;

  try {
    const res = await fetch(`${baseUrl}/associations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      alert("Asociación creada exitosamente");
      fetchAssociations();
    } else {
      alert("Error al crear la asociación");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

// Listar Asociaciones
async function fetchAssociations() {
  try {
    const res = await fetch(`${baseUrl}/associations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const associations = await res.json();
      const list = document.getElementById("associations-list");
      list.innerHTML = "";

      associations.forEach((assoc) => {
        const item = document.createElement("li");
        item.textContent = `${assoc.name}: ${assoc.description}`;
        list.appendChild(item);
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
