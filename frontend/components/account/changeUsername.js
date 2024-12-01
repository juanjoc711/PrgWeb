import { getToken } from '../../utils/utils.js';

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
