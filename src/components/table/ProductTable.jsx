import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Header } from "../Header/Header";
import { getDocs, collection, query, where, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";

export function ProductTable() {
  const [properties, setProperties] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [searchParams, setSearchParams] = useState({
    city: "",
    minPrice: null,
    maxPrice: null,
    minArea: null,
    maxArea: null,
  });

  const toast = useRef(null);

  const searchProperties = async (params) => {
    try {
      let q = query(collection(db, "Flats"));

      if (params.city) {
        q = query(q, where("city", "==", params.city));
      }
      if (params.minPrice !== null && params.minPrice !== undefined) {
        q = query(q, where("rentPrice", ">=", params.minPrice));
      }
      if (params.maxPrice !== null && params.maxPrice !== undefined) {
        q = query(q, where("rentPrice", "<=", params.maxPrice));
      }
      if (params.minArea !== null && params.minArea !== undefined) {
        q = query(q, where("areaSize", ">=", params.minArea));
      }
      if (params.maxArea !== null && params.maxArea !== undefined) {
        q = query(q, where("areaSize", "<=", params.maxArea));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error searching properties:", error);
      throw error;
    }
  };

  useEffect(() => {
    const storedFavorites = localStorage.getItem("propertyFavorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
    handleSearch();
  }, []);

  useEffect(() => {
    localStorage.setItem("propertyFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async () => {
    try {
      const results = await searchProperties(searchParams);
      setProperties(results);
    } catch (error) {
      console.error("Error al buscar propiedades:", error);
    }
  };

  const toggleFavorite = (propertyId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(propertyId)) {
        return prevFavorites.filter((id) => id !== propertyId);
      }
      return [...prevFavorites, propertyId];
    });
  };

  const handleSave = async () => {
    try {
      const propertyRef = doc(db, "Flats", selectedProperty.id);
      await updateDoc(propertyRef, {
        city: selectedProperty.city,
        streetName: selectedProperty.streetName,
        streetNumber: selectedProperty.streetNumber,
        areaSize: selectedProperty.areaSize,
        yearBuilt: selectedProperty.yearBuilt,
        rentPrice: selectedProperty.rentPrice,
        dateAvailable: selectedProperty.dateAvailable,
        hasAC: selectedProperty.hasAC,
      });

      // Actualizar la lista de propiedades
      const updatedProperties = properties.map((property) =>
        property.id === selectedProperty.id ? selectedProperty : property
      );
      setProperties(updatedProperties);

      // Cerrar el diálogo de edición
      setEditVisible(false);

      // Mostrar un mensaje de éxito
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Propiedad actualizada correctamente",
      });
    } catch (error) {
      console.error("Error al actualizar la propiedad:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo actualizar la propiedad",
      });
    }
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
          icon="pi pi-pencil"
          rounded
          outlined
          severity="info"
          onClick={() => {
            setSelectedProperty(rowData);
            setEditVisible(true);
          }}
        />
        <Button
          icon={`pi ${isFavorite ? "pi-heart-fill" : "pi-heart"}`}
          rounded
          outlined
          severity={isFavorite ? "danger" : "secondary"}
          onClick={() => toggleFavorite(rowData.id)}
        />
      </div>
    );
  };

  return (
    <>
      <Header />
      <Toast ref={toast} />
      <div className="card p-4 bg-white flex justify-center items-center">
        <div className="grid gap-4 mb-4">
          {/* Campos de filtro */}
          <div className="col-12 md:col-6 lg:col-3">
            <span className="p-float-label">
              <InputText
                type="text"
                className="p-inputtext-sm text-black"
                id="city"
                value={searchParams.city}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, city: e.target.value })
                }
              />
              <label htmlFor="city">Ciudad</label>
            </span>
          </div>
          <div className="col-12 md:col-6 lg:col-3">
            <span className="p-float-label">
              <InputNumber
                className="p-inputtext-sm text-black"
                id="minPrice"
                value={searchParams.minPrice}
                onValueChange={(e) =>
                  setSearchParams({ ...searchParams, minPrice: e.value })
                }
                mode="currency"
                currency="USD"
              />
              <label htmlFor="minPrice">Precio Mínimo</label>
            </span>
          </div>
          <div className="col-12 md:col-6 lg:col-3">
            <span className="p-float-label">
              <InputNumber
                className="p-inputtext-sm text-black"
                id="maxPrice"
                value={searchParams.maxPrice}
                onValueChange={(e) =>
                  setSearchParams({ ...searchParams, maxPrice: e.value })
                }
                mode="currency"
                currency="USD"
              />
              <label htmlFor="maxPrice">Precio Máximo</label>
            </span>
          </div>
          <div className="col-12 md:col-6 lg:col-3">
            <span className="p-float-label">
              <InputNumber
                className="p-inputtext-sm text-black"
                id="minArea"
                value={searchParams.minArea}
                onValueChange={(e) =>
                  setSearchParams({ ...searchParams, minArea: e.value })
                }
              />
              <label htmlFor="minArea">Área Mínima (m²)</label>
            </span>
          </div>
          <div className="col-12 md:col-6 lg:col-3">
            <span className="p-float-label">
              <InputNumber
                className="p-inputtext-sm text-black"
                id="maxArea"
                value={searchParams.maxArea}
                onValueChange={(e) =>
                  setSearchParams({ ...searchParams, maxArea: e.value })
                }
              />
              <label htmlFor="maxArea">Área Máxima (m²)</label>
            </span>
          </div>
          <div className="col-12 md:col-6 lg:col-3 flex items-center justify-center">
            <Button
              label="Buscar"
              icon="pi pi-search"
              onClick={handleSearch}
              className="w-full bg-sky-500"
            />
          </div>
          <div className="col-12 md:col-6 lg:col-3 flex items-center justify-center">
            <Button
              label="Resetear"
              icon="pi pi-refresh"
              onClick={() => {
                setSearchParams({
                  city: "",
                  minPrice: null,
                  maxPrice: null,
                  minArea: null,
                  maxArea: null,
                });
                handleSearch();
              }}
              className="w-full bg-sky-500"
              severity="secondary"
            />
          </div>
        </div>

        <DataTable value={properties} paginator rows={10}>
          <Column field="areaSize" header="Area Size (m²)" sortable filter />
          <Column field="city" header="City" sortable filter />
          <Column field="rentPrice" header="Rent Price" sortable filter />
          <Column field="streetName" header="Street" sortable filter />
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          />
        </DataTable>

        <Dialog
          header="Detalles de la Propiedad"
          visible={visible}
          style={{ width: "50vw" }}
          onHide={() => setVisible(false)}
        >
          {selectedProperty && (
            <div className="grid">
              <div className="col-6">
                <h5>Información General</h5>
                <p>
                  <strong>Ciudad:</strong> {selectedProperty.city}
                </p>
                <p>
                  <strong>Dirección:</strong> {selectedProperty.streetName}{" "}
                  {selectedProperty.streetNumber}
                </p>
                <p>
                  <strong>Área:</strong> {selectedProperty.areaSize} m²
                </p>
                <p>
                  <strong>Año:</strong> {selectedProperty.yearBuilt}
                </p>
              </div>
              <div className="col-6">
                <h5>Características</h5>
                <p>
                  <strong>Aire Acondicionado:</strong>{" "}
                  {selectedProperty.hasAC ? "Sí" : "No"}
                </p>
                <p>
                  <strong>Precio:</strong> ${selectedProperty.rentPrice}
                </p>
                <p>
                  <strong>Disponible desde:</strong>{" "}
                  {new Date(
                    selectedProperty.dateAvailable
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Favorito:</strong>{" "}
                  <Button
                    icon={`pi ${
                      favorites.includes(selectedProperty.id)
                        ? "pi-heart-fill"
                        : "pi-heart"
                    }`}
                    rounded
                    outlined
                    severity={
                      favorites.includes(selectedProperty.id)
                        ? "danger"
                        : "secondary"
                    }
                    onClick={() => toggleFavorite(selectedProperty.id)}
                  />
                </p>
              </div>
            </div>
          )}
        </Dialog>

        <Dialog
          header="Editar Propiedad"
          visible={editVisible}
          style={{ width: "50vw" }}
          onHide={() => setEditVisible(false)}
        >
          {selectedProperty && (
            <div className="grid">
              <div className="col-6">
                <h5>Información General</h5>
                <div className="p-field">
                  <label htmlFor="city">Ciudad</label>
                  <InputText
                    id="city"
                    value={selectedProperty.city}
                    onChange={(e) =>
                      setSelectedProperty({
                        ...selectedProperty,
                        city: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="p-field">
                  <label htmlFor="streetName">Calle</label>
                  <InputText
                    id="streetName"
                    value={selectedProperty.streetName}
                    onChange={(e) =>
                      setSelectedProperty({
                        ...selectedProperty,
                        streetName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="p-field">
                  <label htmlFor="streetNumber">Número</label>
                  <InputNumber
                    id="streetNumber"
                    value={selectedProperty.streetNumber}
                    onValueChange={(e) =>
                      setSelectedProperty({
                        ...selectedProperty,
                        streetNumber: e.value,
                      })
                    }
                  />
                </div>
                <div className="p-field">
                  <label htmlFor="areaSize">Área (m²)</label>
                  <InputNumber
                    id="areaSize"
                    value={selectedProperty.areaSize}
                    onValueChange={(e) =>
                      setSelectedProperty({
                        ...selectedProperty,
                        areaSize: e.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-6">
                <h5>Características</h5>
                <div className="p-field">
                  <label htmlFor="yearBuilt">Año de Construcción</label>
                  <InputNumber
                    id="yearBuilt"
                    value={selectedProperty.yearBuilt}
                    onValueChange={(e) =>
                      setSelectedProperty({
                        ...selectedProperty,
                        yearBuilt: e.value,
                      })
                    }
                  />
                </div>
                <div className="p-field">
                  <label htmlFor="rentPrice">Precio de Renta</label>
                  <InputNumber
                    id="rentPrice"
                    value={selectedProperty.rentPrice}
                    onValueChange={(e) =>
                      setSelectedProperty({
                        ...selectedProperty,
                        rentPrice: e.value,
                      })
                    }
                    mode="currency"
                    currency="USD"
                  />
                </div>
                <div className="p-field">
                  <label htmlFor="dateAvailable">Fecha Disponible</label>
                  <Calendar
                    id="dateAvailable"
                    value={new Date(selectedProperty.dateAvailable)}
                    onChange={(e) =>
                      setSelectedProperty({
                        ...selectedProperty,
                        dateAvailable: e.value,
                      })
                    }
                    dateFormat="dd/mm/yy"
                    showIcon
                  />
                </div>
                <div className="p-field">
                  <label htmlFor="hasAC">Aire Acondicionado</label>
                  <Checkbox
                    id="hasAC"
                    checked={selectedProperty.hasAC}
                    onChange={(e) =>
                      setSelectedProperty({
                        ...selectedProperty,
                        hasAC: e.checked,
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-12 flex justify-end gap-2 mt-4">
                <Button
                  label="Cancelar"
                  icon="pi pi-times"
                  onClick={() => setEditVisible(false)}
                  className="p-button-secondary"
                />
                <Button
                  label="Guardar"
                  icon="pi pi-check"
                  onClick={handleSave}
                  className="p-button-success"
                />
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </>
  );
}