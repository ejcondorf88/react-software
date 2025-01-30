import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../../firebase'; // Asegúrate de importar tu configuración de Firebase
import { Header } from '../Header/Header';
import 'primereact/resources/themes/saga-blue/theme.css'; // Importa el tema de PrimeReact
import 'primereact/resources/primereact.min.css'; // Importa los estilos de PrimeReact
import 'primeicons/primeicons.css'; // Importa los íconos de PrimeReact

export function Dashboard() {
  const [favoriteIds, setFavoriteIds] = useState([]); // IDs de los favoritos
  const [favoriteProperties, setFavoriteProperties] = useState([]); // Propiedades favoritas
  const [loading, setLoading] = useState(true); // Estado de carga

  // Obtener los IDs de los favoritos del localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('propertyFavorites');
    if (storedFavorites) {
      setFavoriteIds(JSON.parse(storedFavorites));
    }
  }, []);

  // Buscar las propiedades favoritas por sus IDs
  useEffect(() => {
    const fetchFavoriteProperties = async () => {
      if (favoriteIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Crear una consulta para obtener las propiedades con los IDs almacenados
        const propertiesRef = collection(db, 'Flats');
        const q = query(propertiesRef, where('__name__', 'in', favoriteIds)); // Buscar por IDs
        const querySnapshot = await getDocs(q);

        // Mapear los resultados a un array de propiedades
        const propertiesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFavoriteProperties(propertiesData);
      } catch (error) {
        console.error('Error fetching favorite properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProperties();
  }, [favoriteIds]);

  const toggleFavorite = (propertyId) => {
    setFavoriteIds((prevFavorites) => {
      const updatedFavorites = prevFavorites.includes(propertyId)
        ? prevFavorites.filter((id) => id !== propertyId) // Remover si ya está en favoritos
        : [...prevFavorites, propertyId]; // Agregar si no está en favoritos

      // Actualizar el localStorage
      localStorage.setItem('propertyFavorites', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const actionBodyTemplate = (rowData) => {
    const isFavorite = favoriteIds.includes(rowData.id);
    return (
      <Button
        icon={`pi ${isFavorite ? 'pi-heart-fill' : 'pi-heart'}`}
        rounded
        outlined
        severity={isFavorite ? 'danger' : 'secondary'}
        onClick={() => toggleFavorite(rowData.id)}
      />
    );
  };

  if (loading) {
    return <p>Cargando favoritos...</p>;
  }

  return (
    <>
      <Header />
      <div className="card p-4 bg-white flex justify-center items-center">
        <h2>Mis Favoritos</h2>
        {favoriteProperties.length > 0 ? (
          <DataTable value={favoriteProperties} paginator rows={10}>
            <Column field="areaSize" header="Area Size (m²)" sortable />
            <Column field="city" header="City" sortable />
            <Column field="rentPrice" header="Rent Price" sortable />
            <Column field="streetName" header="Street" sortable />
            <Column
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: '8rem' }}
            />
          </DataTable>
        ) : (
          <p>No tienes propiedades favoritas.</p>
        )}
      </div>
    </>
  );
}