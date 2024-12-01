import { getToken } from '../../utils/utils.js';

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
