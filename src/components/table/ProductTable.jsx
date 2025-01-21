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
  const [products, setProducts] = useState([
    // Sample data - replace this with your Supabase data
   
    
    
  
  ]);
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
      console.log(fetchedProducts);
    };
    fetchProducts();
  }, []); // <- Añadir array de dependencias vacío
  

  return (
    <>
    <Header />
    <div >
      <DataTable
        value={products}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        dataKey="id"
        filters={{ global: { value: globalFilter, matchMode: 'contains' } }}
        filterDisplay="menu"
        globalFilterFields={['name', 'category', 'status']}
        header={<HeaderTable />}
        emptyMessage="No products found."
        className="p-datatable-lg"
        stripedRows
        showGridlines
      >
        <Column 
          field="name" 
          header="Name" 
          sortable 
          filter 
          filterPlaceholder="Search by name"
          body={(rowData) => <span>{rowData.Name}</span>}
        />
        <Column 
          field="price" 
          header="Price" 
          sortable 
          filter 
          filterPlaceholder="Search by price"
          body={(rowData) => <span>${rowData.Price}</span>}
        />
       
        <Column 
          field="category" 
          header="Category" 
          sortable 
          filter 
          filterPlaceholder="Search by category"
        />
        <Column 
          field="status" 
          header="Status" 
          sortable 
          filter 
          filterPlaceholder="Search by status"
        />
      </DataTable>
    </div>
    </>
  );
}