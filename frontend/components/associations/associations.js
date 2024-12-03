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

      // Si no se pasa `myAssociations`, obtén los IDs actualizados
      if (!myAssociations) {
        myAssociations = (await fetchMyAssociations(false)).map((assoc) => assoc._id);
      }

      console.log("Asociaciones obtenidas:", associations);
      console.log("Mis asociaciones actualizadas:", myAssociations);

      renderAssociationsTable(associations, myAssociations); // Renderiza correctamente
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

      // Obtener solo IDs actualizados de "Mis Asociaciones"
      const myAssociations = (await fetchMyAssociations(false)).map((assoc) => assoc._id);

      // Actualizar las vistas
      const currentView = document.querySelector("section[style='display: block;']").id;

      if (currentView === "my-associations-view") {
        renderMyAssociationsTable(await fetchMyAssociations(false)); // Refresca "Mis Asociaciones"
      } else {
        await fetchAssociations(myAssociations); // Actualiza la vista principal con los IDs actualizados
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
      console.log("Asociaciones devueltas del backend:", associations);

      if (render) renderMyAssociationsTable(associations); // Renderizar correctamente

      return associations; // Devuelve los datos correctamente
    } else {
      console.error("Error al obtener tus asociaciones:", res.status);
      return [];
    }
  } catch (error) {
    console.error("Error al obtener tus asociaciones:", error);
    return [];
  }
}



export async function createAssociation(name, description, imageFile) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  if (imageFile) formData.append('image', imageFile);

  try {
      const res = await fetch('http://localhost:3000/associations', {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${getToken()}`,
          },
          body: formData,
      });

      if (res.ok) {
          alert('Asociación creada exitosamente');
      } else {
          alert('Error al crear la asociación');
      }
  } catch (error) {
      console.error('Error al crear la asociación:', error);
  }
}

//buscar asociacion por nombre

export async function searchAssociations(query) {
  try {
      const res = await fetch(`http://localhost:3000/associations/search?query=${query}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (res.ok) {
          const associations = await res.json();
          renderAssociationsTable(associations, await fetchMyAssociations(false)); // Renderiza resultados
      } else {
          console.error("Error al buscar asociaciones: ", res.status);
      }
  } catch (error) {
      console.error("Error al buscar asociaciones:", error);
  }
}

//elimninar asociaciones
export async function deleteAssociation(associationId) {
  try {
    const res = await fetch(`http://localhost:3000/associations/${associationId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (res.ok) {
      alert("Asociación eliminada con éxito");

      // Actualizar ambas vistas
      const myAssociations = await fetchMyAssociations(false); // Obtiene las asociaciones actualizadas
      renderMyAssociationsTable(myAssociations);

      // Refresca la tabla de asociaciones principales con IDs actualizados
      await fetchAssociations(myAssociations.map((assoc) => assoc._id));
    } else {
      alert("Error al eliminar la asociación");
    }
  } catch (error) {
    console.error("Error al eliminar la asociación:", error);
  }
}
