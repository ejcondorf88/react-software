import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Header } from '../Header/Header';
import { Footer } from '../foo/Footer';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';

import { Checkbox } from 'primereact/checkbox';
        

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
      
      <div className="flex-col items-center">
      <Header />
      <Card className="w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Property Details</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="city" className="text-gray-700 font-medium">City</label>
              <InputText 
                id="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className={`p-inputtext-sm ${errors.city ? 'p-invalid' : ''}`}
              />
              {errors.city && <small className="text-red-500">{errors.city}</small>}
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="streetName" className="text-gray-700 font-medium">Street Name</label>
              <InputText 
                id="streetName"
                value={formData.streetName}
                onChange={handleChange}
                placeholder="Enter street name"
                className={`p-inputtext-sm ${errors.streetName ? 'p-invalid' : ''}`}
              />
              {errors.streetName && <small className="text-red-500">{errors.streetName}</small>}
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="streetNumber" className="text-gray-700 font-medium">Street Number</label>
              <InputNumber 
                id="streetNumber"
                value={formData.streetNumber}
                onChange={(e) => handleChange({ target: { id: 'streetNumber', value: e.value }})}
                placeholder="Enter street number"
                className={`p-inputtext-sm ${errors.streetNumber ? 'p-invalid' : ''}`}
              />
              {errors.streetNumber && <small className="text-red-500">{errors.streetNumber}</small>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="areaSize" className="text-gray-700 font-medium">Area Size</label>
              <InputNumber 
                id="areaSize"
                value={formData.areaSize}
                onChange={(e) => handleChange({ target: { id: 'areaSize', value: e.value }})}
                placeholder="Enter area size"
                className={`p-inputtext-sm ${errors.areaSize ? 'p-invalid' : ''}`}
              />
              {errors.areaSize && <small className="text-red-500">{errors.areaSize}</small>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="hasAC" className="text-gray-700 font-medium">Has AC</label>
              <Checkbox 
                id="hasAC"
                checked={formData.hasAC}
                onChange={(e) => handleChange({ target: { id: 'hasAC', value: e.checked }})}
                className={errors.hasAC ? 'p-invalid' : ''}
              />
              {errors.hasAC && <small className="text-red-500">{errors.hasAC}</small>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="yearBuilt" className="text-gray-700 font-medium">Year Built</label>
              <InputNumber 
                id="yearBuilt"
                value={formData.yearBuilt}
                onChange={(e) => handleChange({ target: { id: 'yearBuilt', value: e.value }})}
                placeholder="Enter year built"
                className={`p-inputtext-sm ${errors.yearBuilt ? 'p-invalid' : ''}`}
              />
              {errors.yearBuilt && <small className="text-red-500">{errors.yearBuilt}</small>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="rentPrice" className="text-gray-700 font-medium">Rent Price</label>
              <InputNumber 
                id="rentPrice"
                value={formData.rentPrice}
                onChange={(e) => handleChange({ target: { id: 'rentPrice', value: e.value }})}
                mode="currency" 
                currency="USD"
                className={`p-inputtext-sm ${errors.rentPrice ? 'p-invalid' : ''}`}
              />
              {errors.rentPrice && <small className="text-red-500">{errors.rentPrice}</small>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="dateAvailable" className="text-gray-700 font-medium">Date Available</label>
              <Calendar 
                id="dateAvailable"
                value={formData.dateAvailable}
                onChange={(e) => handleChange({ target: { id: 'dateAvailable', value: e.value }})}
                className={errors.dateAvailable ? 'p-invalid' : ''}
              />
              {errors.dateAvailable && <small className="text-red-500">{errors.dateAvailable}</small>}
            </div>

            <Button 
              type="submit"
              label="Submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            />
          </form>
        </Card>
      </div>
    </>
);
};