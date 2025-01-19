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

export const Profile = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Initialize form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    lastName: '',
    birthday: null,
    rol: 'ADMIN'
  });
  
  const [errors, setErrors] = useState({});
  
  // Use useEffect to handle navigation and form data initialization
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Initialize form with user data once user is available
    setFormData({
      email: user.email || '',
      password: user.password || '',
      name: user.name || '',
      lastName: user.lastName || '',
      birthday: user.birthday || null,
      rol: user.rol || 'ADMIN'
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    
    if (Object.keys(validationErrors).length === 0) {
      if (toast.current) {
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully'
        });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  // Add a loading state while user data is being fetched
  if (!user) {
    return null; // or return a loading spinner
  }

  return (
    <div className="flex-col items-center">
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