import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Header } from '../Header/Header';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Asegúrate de importar tu configuración de Firebase

// Importa los estilos de PrimeReact
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [menuModel, setMenuModel] = useState([]); // Estado para manejar el modelo del menú
    const [displayRoleDialog, setDisplayRoleDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newRole, setNewRole] = useState('');
    const menuRef = useRef(null);
    const toast = useRef(null);

    // Obtener usuarios desde Firestore
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, 'Users'); // Cambia 'Users' por el nombre de tu colección
                const querySnapshot = await getDocs(usersCollection);

                const usersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setUsers(usersData);
                console.log('Users fetched:', usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to fetch users',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Función para eliminar un usuario
    const deleteUser = async (userId) => {
        try {
            await deleteDoc(doc(db, 'Users', userId)); // Cambia 'Users' por el nombre de tu colección
            setUsers(users.filter(user => user.id !== userId));
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'User deleted successfully',
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete user',
            });
        }
    };

    // Función para actualizar el rol de un usuario
    const updateUserRole = async (userId, newRole) => {
        try {
            const userDoc = doc(db, 'Users', userId);
            await updateDoc(userDoc, { rol: newRole });
            
            // Actualizar el estado local
            setUsers(users.map(user => 
                user.id === userId ? { ...user, rol: newRole } : user
            ));

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'User role updated successfully',
            });
        } catch (error) {
            console.error('Error updating user role:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update user role',
            });
        }
    };

    // Menú contextual para acciones (editar, cambiar rol, eliminar)
    const menuItems = (userId) => [
        {
            label: 'Edit',
            icon: 'pi pi-pencil',
            command: () => {
                toast.current.show({ severity: 'info', summary: 'Edit', detail: 'Edit user clicked' });
            }
        },
        {
            label: 'Change Role',
            icon: 'pi pi-user-edit',
            command: () => {
                openRoleDialog(userId);
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () => {
                deleteUser(userId);
            }
        }
    ];

    // Plantilla para las acciones en la tabla
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button 
                    icon="pi pi-ellipsis-v" 
                    rounded 
                    text 
                    severity="secondary"
                    onClick={(e) => {
                        setMenuModel(menuItems(rowData.id)); // Actualiza el modelo del menú
                        menuRef.current.toggle(e); // Muestra el menú
                    }}
                    aria-controls="popup_menu" 
                    aria-haspopup
                />
            </div>
        );
    };

    // Diálogo para cambiar el rol
    const openRoleDialog = (userId) => {
        setSelectedUserId(userId);
        setDisplayRoleDialog(true);
    };

    const closeRoleDialog = () => {
        setDisplayRoleDialog(false);
        setSelectedUserId(null);
        setNewRole('');
    };

    const handleRoleChange = () => {
        if (selectedUserId && newRole) {
            updateUserRole(selectedUserId, newRole);
            closeRoleDialog();
        }
    };

    const roleDialogFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={closeRoleDialog} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={handleRoleChange} autoFocus />
        </div>
    );

    // Header de la tabla
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
            <div>
                <Toast ref={toast} />
                <Menu model={menuModel} popup ref={menuRef} />
                
                {/* Diálogo para cambiar el rol */}
                <Dialog 
                    header="Change User Role" 
                    visible={displayRoleDialog} 
                    style={{ width: '450px' }} 
                    footer={roleDialogFooter} 
                    onHide={closeRoleDialog}
                >
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="newRole">New Role</label>
                            <InputText 
                                id="newRole" 
                                value={newRole} 
                                onChange={(e) => setNewRole(e.target.value)} 
                                placeholder="Enter new role"
                            />
                        </div>
                    </div>
                </Dialog>

                {/* Tabla de usuarios */}
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
                        field="rol" 
                        header="Rol" 
                        sortable 
                        filter 
                        filterPlaceholder="Search by role"
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