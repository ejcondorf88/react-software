import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import {Password} from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Header } from '../Header/Header';
import { Footer } from '../foo/Footer';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { validateForm as validate } from '../../utils/validate';
export const Profile = () => {
    const formData = {
        email: '',
        age: '',
        name: '',
        lastName: '',
        password: '',
        phone: '',
        rol: 'ADMIN',
    }
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate(formData)) {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Profile updated successfully'
          });
        }
      };
    
    

    return (
        <>
          
          <div className="flex-col items-center">
            <Header />
            <Card className="w-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 text-center">Profile</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
                  <InputText
                    id="email"
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
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    toggleMask
                    className={errors.password ? 'p-invalid' : ''}
                  />
                  {errors.password && <small className="text-red-500">{errors.password}</small>}
                </div>
    
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className="text-gray-700 font-medium">First Name</label>
                  <InputText
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className={`p-inputtext-sm ${errors.firstName ? 'p-invalid' : ''}`}
                  />
                  {errors.firstName && <small className="text-red-500">{errors.firstName}</small>}
                </div>
    
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</label>
                  <InputText
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className={`p-inputtext-sm ${errors.lastName ? 'p-invalid' : ''}`}
                  />
                  {errors.lastName && <small className="text-red-500">{errors.lastName}</small>}
                </div>
    
                <div className="flex flex-col gap-2">
                  <label htmlFor="birthDate" className="text-gray-700 font-medium">Birth Date</label>
                  <Calendar
                    id="birthDate"
                    value={formData.birthDate}
                    onChange={(e) => handleChange({ target: { id: 'birthDate', value: e.value }})}
                    className={errors.birthDate ? 'p-invalid' : ''}
                  />
                  {errors.birthDate && <small className="text-red-500">{errors.birthDate}</small>}
                </div>
    
                <Button
                  type="submit"
                  label="Save Profile"
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                />
              </form>
            </Card>
          </div>
        </>


    );
        
        
    


  };
