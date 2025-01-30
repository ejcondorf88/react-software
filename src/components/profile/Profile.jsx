import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Header } from '../Header/Header';
import { Calendar } from 'primereact/calendar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { validateForm as validate } from '../../utils/validate';
import { getAuth } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export const Profile = () => {
  const toast = useRef(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const auth = getAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    lastName: '',
    birthday: null,
    rol: 'ADMIN'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  // Función para validar y formatear la fecha
  const formatDateForFirestore = (date) => {
    if (!date) return null;
    
    try {
      // Asegurarse de que la fecha sea válida
      const validDate = new Date(date);
      if (isNaN(validDate.getTime())) {
        throw new Error('Fecha inválida');
      }
      
      // Establecer la hora a mediodía para evitar problemas con zonas horarias
      validDate.setHours(12, 0, 0, 0);
      
      return validDate.toISOString();
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return null;
    }
  };

  // Función para convertir la fecha de Firestore a objeto Date
  const convertFirestoreDate = (firestoreDate) => {
    if (!firestoreDate) return null;
    
    try {
      const date = new Date(firestoreDate);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        const q = query(collection(db, "Users"), where("email", "==", user?.email)); // Usar user?.email
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUserId(userDoc.id);
          const userData = userDoc.data();
          
          setFormData({
            email: userData.email || '',
            password: userData.password || '',
            name: userData.name || '',
            lastName: userData.lastName || '',
            birthday: convertFirestoreDate(userData.birthday),
            rol: userData.rol || 'ADMIN'
          });
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los datos del usuario'
        });
      } finally {
        setLoading(false); // Finalizar la carga
      }
    };

    fetchUserData();
  }, [auth, navigate, user?.email]); // Usar user?.email

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const userRef = doc(db, 'Users', userId);
        
        const formattedBirthday = formatDateForFirestore(formData.birthday);
        
        const updateData = {
          name: formData.name,
          lastName: formData.lastName,
          birthday: formattedBirthday,
          rol: formData.rol
        };

        await updateDoc(userRef, updateData);
        
        updateUser({
          ...user,
          ...updateData,
          birthday: formData.birthday
        });

        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Perfil actualizado correctamente'
        });
      } catch (error) {
        console.error("Error al actualizar el perfil:", error);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar el perfil'
        });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleDateChange = (e) => {
    const date = e.value;
    setFormData(prevData => ({
      ...prevData,
      birthday: date
    }));
  };

  if (loading) {
    return <div>Cargando...</div>; // Mostrar un mensaje de carga
  }

  if (!user) {
    return <div>Usuario no conectado</div>; // Mostrar un mensaje si el usuario no está autenticado
  }

  return (
    <div className="flex flex-col items-center">
      <Toast ref={toast} />
      <Header user={formData.name} />
      <Card className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Perfil</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-gray-700 font-medium">Correo electrónico</label>
            <InputText
              id="email"
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingrese correo electrónico"
              className={`p-inputtext-sm ${errors.email ? 'p-invalid' : ''}`}
            />
            {errors.email && <small className="text-red-500">{errors.email}</small>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-gray-700 font-medium">Nombre</label>
            <InputText
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingrese nombre"
              className={`p-inputtext-sm ${errors.name ? 'p-invalid' : ''}`}
            />
            {errors.name && <small className="text-red-500">{errors.name}</small>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="text-gray-700 font-medium">Apellido</label>
            <InputText
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Ingrese apellido"
              className={`p-inputtext-sm ${errors.lastName ? 'p-invalid' : ''}`}
            />
            {errors.lastName && <small className="text-red-500">{errors.lastName}</small>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="birthday" className="text-gray-700 font-medium">Fecha de nacimiento</label>
            <Calendar
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleDateChange}
              dateFormat="dd/mm/yy"
              showIcon
              className={errors.birthday ? 'p-invalid' : ''}
            />
            {errors.birthday && <small className="text-red-500">{errors.birthday}</small>}
          </div>

          <Button
            type="submit"
            label="Guardar Perfil"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          />
        </form>
      </Card>
    </div>
  );
};