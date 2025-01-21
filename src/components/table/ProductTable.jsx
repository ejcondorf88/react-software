import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Header } from '../Header/Header';
import { HeaderTable } from './HeaaderTable';
import {getDocs, collection, query, where} from 'firebase/firestore'
import { db } from '../../firebase';


export function ProductTable() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'Flats');
      const q = query(productsCollection);
      const querySnapshot = await getDocs(q);
      const fetchedProducts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(fetchedProducts);
    };
    fetchProducts();
  }, []);

  const dateTemplate = (rowData, field) => {
    return new Date(rowData[field]).toLocaleDateString();
  };

  const booleanTemplate = (rowData) => {
    return rowData.hasAC ? 'Yes' : 'No';
  };

  return (
    <>
      <Header />
      <div>
        <DataTable
          value={products}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          dataKey="id"
          filters={{ global: { value: globalFilter, matchMode: 'contains' } }}
          filterDisplay="menu"
          globalFilterFields={['city', 'streetName', 'areaSize']}
          header={<HeaderTable />}
          emptyMessage="No properties found."
          className="p-datatable-lg"
          stripedRows
          showGridlines
          responsiveLayout="scroll"
        >
          <Column 
            field="areaSize" 
            header="Area (m²)" 
            sortable 
            filter 
            filterPlaceholder="Search by area"
          />
          <Column 
            field="city" 
            header="City" 
            sortable 
            filter 
            filterPlaceholder="Search by city"
          />
          <Column 
            field="dateAvailable" 
            header="Available Date" 
            sortable
            body={(rowData) => dateTemplate(rowData, 'dateAvailable')}
            filter 
            filterPlaceholder="Search by date"
          />
          <Column 
            field="hasAC" 
            header="AC" 
            sortable
            body={booleanTemplate}
            filter 
            filterPlaceholder="Search by AC"
          />
          <Column 
            field="rentPrice" 
            header="Rent Price" 
            sortable 
            filter 
            filterPlaceholder="Search by price"
          />
          <Column 
            field="streetName" 
            header="Street" 
            sortable 
            filter 
            filterPlaceholder="Search by street"
          />
          <Column 
            field="streetNumber" 
            header="Number" 
            sortable 
            filter 
            filterPlaceholder="Search by number"
          />
          <Column 
            field="yearBuilt" 
            header="Year Built" 
            sortable 
            filter 
            filterPlaceholder="Search by year"
          />
        </DataTable>
      </div>
    </>
  );
}