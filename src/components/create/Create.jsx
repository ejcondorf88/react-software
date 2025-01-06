import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Header } from '../Header/Header';

export const Create = () => {
  const toast = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Profile created successfully'
      });
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  return (
    <>
      <Toast ref={toast} />
      
      <div className="flex-col  items-center ">
      <Header />
      <Card className="w-full ">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Create Profile</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-gray-700 font-medium">Name</label>
              <InputText 
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={`p-inputtext-sm ${errors.name ? 'p-invalid' : ''}`}
              />
              {errors.name && <small className="text-red-500">{errors.name}</small>}
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</label>
              <InputText 
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className={`p-inputtext-sm ${errors.lastName ? 'p-invalid' : ''}`}
              />
              {errors.lastName && <small className="text-red-500">{errors.lastName}</small>}
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
              <InputText 
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`p-inputtext-sm ${errors.email ? 'p-invalid' : ''}`}
              />
              {errors.email && <small className="text-red-500">{errors.email}</small>}
            </div>

            <Button 
              type="submit"
              label="Create Profile"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            />
          </form>
        </Card>
      </div>
    </>
  );
};