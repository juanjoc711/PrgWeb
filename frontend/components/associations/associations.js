import { getToken } from '../../utils/utils.js';
import { renderAssociationsTable } from './renderAssociationsTable.js';
import { renderMyAssociationsTable } from './renderMyAssociationsTable.js';

export async function fetchAssociations(myAssociations = null) {
  try {
    const res = await fetch(`http://localhost:3000/associations`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (res.ok) {
      const associations = await res.json();
      if (!myAssociations) {
        myAssociations = await fetchMyAssociations(false); // Solo IDs
      }
      console.log("Asociaciones obtenidas:", associations);
      console.log("Mis asociaciones actualizadas:", myAssociations);
      renderAssociationsTable(associations, myAssociations);
    } else {
      console.error("Error al obtener las asociaciones: ", res.status);
    }
  } catch (error) {
    console.error("Error al obtener las asociaciones:", error);
  }
}

export async function joinAssociation(associationId) {
  try {
    const res = await fetch(`http://localhost:3000/associations/${associationId}/join`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (res.ok) {
      alert("Te has unido a la asociación");
      fetchAssociations();
    } else {
      alert("Error al unirte a la asociación");
    }
  } catch (error) {
    console.error("Error al unirse a la asociación:", error);
  }
}

export async function leaveAssociation(associationId) {
  try {
    const res = await fetch(`http://localhost:3000/associations/${associationId}/leave`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (res.ok) {
      alert("Has abandonado la asociación");

      const currentView = document.querySelector("section[style='display: block;']").id;

      if (currentView === "my-associations-view") {
        fetchMyAssociations(); // Refrescar tabla de "Mis Asociaciones"
      } else {
        const myAssociations = await fetchMyAssociations(false);
        fetchAssociations(myAssociations); // Refrescar vista principal
      }
    } else {
      alert("Error al abandonar la asociación");
    }
  } catch (error) {
    console.error("Error al abandonar la asociación:", error);
  }
}

export async function fetchMyAssociations(render = true) {
  try {
    const res = await fetch(`http://localhost:3000/associations/my`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (res.ok) {
      const associations = await res.json();
      if (render) {
        renderMyAssociationsTable(associations);
      }
      return associations.map((assoc) => assoc._id); // IDs para uso interno
    } else {
      console.error("Error al obtener tus asociaciones:", res.status);
    }
  } catch (error) {
    console.error("Error al obtener tus asociaciones:", error);
  }
}

export async function createAssociation(name, description) {
  try {
    const res = await fetch(`http://localhost:3000/associations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
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
    console.error("Error al crear la asociación:", error);
  }
}
