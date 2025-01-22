import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Header } from '../Header/Header';
import { HeaderTable } from './HeaaderTable';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

export function ProductTable() {
  const [properties, setProperties] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Load favorites from localStorage on component mount
    const storedFavorites = localStorage.getItem('propertyFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }

    const fetchProducts = async () => {
      const productsCollection = collection(db, 'Flats');
      const q = query(productsCollection);
      const querySnapshot = await getDocs(q);
      const fetchedProducts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setProperties(fetchedProducts);
    };
    fetchProducts();
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('propertyFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (propertyId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(propertyId)) {
        return prevFavorites.filter(id => id !== propertyId);
      } else {
        return [...prevFavorites, propertyId];
      }
    });
  };

  const formatDate = (value) => {
    return new Date(value).toLocaleDateString();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const actionBodyTemplate = (rowData) => {
    const isFavorite = favorites.includes(rowData.id);
    
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          rounded
          outlined
          onClick={() => {
            setSelectedProperty(rowData);
            setVisible(true);
          }}
        />
        <Button
          icon={`pi ${isFavorite ? 'pi-heart-fill' : 'pi-heart'}`}
          rounded
          outlined
          severity={isFavorite ? 'danger' : 'secondary'}
          onClick={() => toggleFavorite(rowData.id)}
        />
      </div>
    );
  };

  return (
    <>
      <Header />
      <div>
        <DataTable value={properties} paginator rows={10}>
          <Column field="areaSize" header="Area Size (m²)" sortable filter />
          <Column field="city" header="City" sortable filter />
          <Column field="rentPrice" header="Rent Price" sortable filter />
          <Column field="streetName" header="Street" sortable filter />
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: '12rem' }}
          />
        </DataTable>

        <Dialog
          header="Detalles de la Propiedad"
          visible={visible}
          style={{ width: '50vw' }}
          onHide={() => setVisible(false)}
        >
          {selectedProperty && (
            <div className="grid">
              <div className="col-6">
                <h5>Información General</h5>
                <p><strong>Ciudad:</strong> {selectedProperty.city}</p>
                <p><strong>Dirección:</strong> {selectedProperty.streetName} {selectedProperty.streetNumber}</p>
                <p><strong>Área:</strong> {selectedProperty.areaSize} m²</p>
                <p><strong>Año:</strong> {selectedProperty.yearBuilt}</p>
              </div>
              <div className="col-6">
                <h5>Características</h5>
                <p><strong>Aire Acondicionado:</strong> {selectedProperty.hasAC ? 'Sí' : 'No'}</p>
                <p><strong>Precio:</strong> ${selectedProperty.rentPrice}</p>
                <p><strong>Disponible desde:</strong> {formatDate(selectedProperty.dateAvailable)}</p>
                <p>
                  <strong>Favorito:</strong> {' '}
                  <Button
                    icon={`pi ${favorites.includes(selectedProperty.id) ? 'pi-heart-fill' : 'pi-heart'}`}
                    rounded
                    outlined
                    severity={favorites.includes(selectedProperty.id) ? 'danger' : 'secondary'}
                    onClick={() => toggleFavorite(selectedProperty.id)}
                  />
                </p>
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </>
  );
}