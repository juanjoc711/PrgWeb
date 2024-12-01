import { getToken } from "./utils.js";


export async function changeUsername(newUsername) {
  try {
    const res = await fetch(`http://localhost:3000/auth/change-username`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newUsername }),
    });

    if (res.ok) {
      alert("Nombre de usuario cambiado exitosamente");
    } else {
      alert("Error al cambiar el nombre de usuario");
    }
  } catch (error) {
    console.error("Error al cambiar el nombre de usuario:", error);
  }
}

export async function changePassword(currentPassword, newPassword) {
  try {
    const res = await fetch(`http://localhost:3000/auth/change-password`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (res.ok) {
      alert("Contraseña cambiada exitosamente");
    } else {
      alert("Error al cambiar la contraseña");
    }
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
  }
}

