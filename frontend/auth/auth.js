import { setToken, getToken } from "../utils/utils.js";

export async function register(username, password) {
    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      if (res.ok) {
        alert('Usuario registrado con éxito');
      } else {
        const error = await res.text();
        alert(`Error al registrar: ${error}`);
      }
    } catch (error) {
      console.error('Error al registrarse:', error);
    }
  }
  
  export async function login(username, password, callback) {
    try {
      const res = await fetch(`http://localhost:3000/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (res.ok) {
        const data = await res.json();
        setToken(data.token); 
        alert("Login exitoso");
        callback();
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  }
  
  

export async function changeUsername(newUsername) {
    try {
        const res = await fetch(`http://localhost:3000/auth/change-username`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ newUsername }),
        });

        if (!res.ok) {
            const error = await res.json();
            alert(error.message || "Error al actualizar el nombre de usuario");
            return;
        }

        alert("Nombre de usuario actualizado con éxito");
    } catch (error) {
        console.error("Error al cambiar el nombre de usuario:", error);
    }
}

export async function changePassword(currentPassword, newPassword) {
    try {
        const res = await fetch(`http://localhost:3000/auth/change-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        if (!res.ok) {
            // Intentar leer la respuesta como JSON
            const error = await res.json().catch(() => null);
            if (error && error.message) {
                alert(error.message); // Mostrar el mensaje de error del backend
            } else {
                alert("Error desconocido al actualizar la contraseña");
            }
            return;
        }

        alert("Contraseña actualizada con éxito");
    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        alert("Hubo un problema al intentar actualizar la contraseña.");
    }
}
