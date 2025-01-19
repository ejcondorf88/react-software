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
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export const Profile = () => {
  const toast = useRef(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
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
  
  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      setUserId(currentUser.uid);
      
      try {
        // Obtener datos del usuario desde Firestore
        const userRef = doc(db, 'Users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setFormData({
            email: userData.email || '',
            password: userData.password || '',
            name: userData.name || '',
            lastName: userData.lastName || '',
            birthday: userData.birthday ? new Date(userData.birthday) : null,
            rol: userData.rol || 'ADMIN'
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load user data'
        });
      }
    };

    fetchUserData();
  }, [auth, navigate]);

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
    
    // Si NO hay errores de validación
    if (Object.keys(validationErrors).length === 0) {
      try {
        const userRef = doc(db, 'Users', userId);
        
        // Preparar datos para actualizar
        const updateData = {
          email: formData.email,
          name: formData.name,
          lastName: formData.lastName,
          birthday: formData.birthday,
          rol: formData.rol
        };

        // Actualizar el documento
        await updateDoc(userRef, updateData);

        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully'
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update profile'
        });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <Toast ref={toast} />
      <Header user={user.name} />
      <Card className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Profile</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
            <InputText
              id="email"
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className={`p-inputtext-sm ${errors.email ? 'p-invalid' : ''}`}
            />
            {errors.email && <small className="text-red-500">{errors.email}</small>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-gray-700 font-medium">Password</label>
            <Password
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              toggleMask
              className={errors.password ? 'p-invalid' : ''}
            />
            {errors.password && <small className="text-red-500">{errors.password}</small>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-gray-700 font-medium">First Name</label>
            <InputText
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter first name"
              className={`p-inputtext-sm ${errors.name ? 'p-invalid' : ''}`}
            />
            {errors.name && <small className="text-red-500">{errors.name}</small>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</label>
            <InputText
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className={`p-inputtext-sm ${errors.lastName ? 'p-invalid' : ''}`}
            />
            {errors.lastName && <small className="text-red-500">{errors.lastName}</small>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="birthday" className="text-gray-700 font-medium">Birth Date</label>
            <Calendar
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={(e) => handleChange({ target: { name: 'birthday', value: e.value }})}
              className={errors.birthday ? 'p-invalid' : ''}
            />
            {errors.birthday && <small className="text-red-500">{errors.birthday}</small>}
          </div>

          <Button
            type="submit"
            label="Save Profile"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          />
        </form>
      </Card>
    </div>
  );
};