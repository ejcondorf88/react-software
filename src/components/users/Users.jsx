import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Menu } from 'primereact/menu';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import {Header} from '../Header/Header'
// Don't forget to import PrimeReact CSS
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";

export const Users = () => {
    const [users, setUsers] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const menuRef = useRef(null);
    const toast = useRef(null);

    // Mock data - replace with your API call
    useEffect(() => {
        const mockUsers = [
            { 
                id: 1, 
                name: 'John Doe', 
                email: 'john@example.com', 
                role: 'Admin', 
                status: 'active',
                lastLogin: '2024-01-15'
            },
            { 
                id: 2, 
                name: 'Jane Smith', 
                email: 'jane@example.com', 
                role: 'User', 
                status: 'inactive',
                lastLogin: '2024-01-10'
            },
            // Add more mock data as needed
        ];

        setUsers(mockUsers);
        setLoading(false);
    }, []);

    const menuItems = [
        {
            label: 'Edit',
            icon: 'pi pi-pencil',
            command: () => {
                toast.current.show({ severity: 'info', summary: 'Edit', detail: 'Edit user clicked' });
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () => {
                toast.current.show({ severity: 'error', summary: 'Delete', detail: 'Delete user clicked' });
            }
        }
    ];

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button 
                    icon="pi pi-ellipsis-v" 
                    rounded 
                    text 
                    severity="secondary"
                    onClick={(e) => {
                        menuRef.current.toggle(e);
                        menuRef.current.props.model = menuItems;
                    }}
                    aria-controls="popup_menu" 
                    aria-haspopup
                />
            </div>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <Tag 
                value={rowData.status} 
                severity={rowData.status === 'active' ? 'success' : 'danger'}
                className="capitalize"
            />
        );
    };

    const header = (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex-1">
                <h1 className="text-2xl font-bold">Users Management</h1>
            </div>
            <div className="flex gap-4 items-center">
                <span className="p-input-icon-left w-full sm:w-auto">
                    <i className="pi pi-search" />
                    <InputText
                        type="search"
                        className="w-full sm:w-64"
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search users..."
                    />
                </span>
                <Button 
                    label="Add User" 
                    icon="pi pi-user-plus"
                    severity="success"
                    onClick={() => toast.current.show({ 
                        severity: 'success', 
                        summary: 'Add User', 
                        detail: 'Add user clicked' 
                    })}
                />
            </div>
        </div>
    );

    return (
        <>
        <Header />
        
        <div >
            <Toast ref={toast} />
            <Menu model={menuItems} popup ref={menuRef} />
            
            <DataTable
                value={users}
                header={header}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                globalFilter={globalFilter}
                emptyMessage="No users found."
                loading={loading}
                className="p-datatable-striped"
                removableSort
                resizableColumns
                showGridlines
            >
                <Column 
                    field="name" 
                    header="Name" 
                    sortable 
                    filter 
                    filterPlaceholder="Search by name"
                />
                <Column 
                    field="email" 
                    header="Email" 
                    sortable 
                    filter 
                    filterPlaceholder="Search by email"
                />
                <Column 
                    field="role" 
                    header="Role" 
                    sortable 
                    filter 
                    filterPlaceholder="Search by role"
                    className="w-[150px]"
                />
                <Column 
                    field="status" 
                    header="Status" 
                    body={statusBodyTemplate}
                    sortable
                    filter
                    filterPlaceholder="Search by status"
                    className="w-[150px]"
                />
                <Column 
                    field="lastLogin" 
                    header="Last Login" 
                    sortable
                    className="w-[150px]"
                />
                <Column 
                    body={actionBodyTemplate} 
                    exportable={false} 
                    style={{ width: '3rem' }}
                />
            </DataTable>
        </div>
        </>
    );
};

