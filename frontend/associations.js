import { getToken } from "./utils.js";

export async function fetchAssociations() {
  try {
    const res = await fetch(`http://localhost:3000/associations`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (res.ok) {
      const associations = await res.json();
      const myAssociations = await fetchMyAssociations(false); // Obtener asociaciones del usuario sin renderizar
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
      fetchAssociations();
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
      if (render) renderAssociationsTable(associations, associations);
      return associations.map((assoc) => assoc._id); // Retornar solo los IDs
    }
  } catch (error) {
    console.error("Error al obtener tus asociaciones:", error);
  }
}

function renderAssociationsTable(associations, myAssociations) {
  const tableBody = document.getElementById("associations-body");
  tableBody.innerHTML = "";

  associations.forEach((assoc) => {
    const row = document.createElement("tr");

    const logoCell = document.createElement("td");
    logoCell.textContent = "📷";
    row.appendChild(logoCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = assoc.name;
    row.appendChild(nameCell);

    const descCell = document.createElement("td");
    descCell.textContent = assoc.description;
    row.appendChild(descCell);

    const actionCell = document.createElement("td");

    if (myAssociations.includes(assoc._id)) {
      const leaveButton = document.createElement("button");
      leaveButton.textContent = "Abandonar";
      leaveButton.onclick = () => leaveAssociation(assoc._id);
      actionCell.appendChild(leaveButton);
    } else {
      const joinButton = document.createElement("button");
      joinButton.textContent = "Unirse";
      joinButton.onclick = () => joinAssociation(assoc._id);
      actionCell.appendChild(joinButton);
    }

    row.appendChild(actionCell);
    tableBody.appendChild(row);
  });
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
