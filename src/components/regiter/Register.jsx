import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { Lock } from 'lucide-react';
import { InputNumber } from 'primereact/inputnumber';

import { Mail, MapPin, User, CreditCard } from 'lucide-react';
import { InputField } from '../form/InputField'
import { SelectField } from '../form/SelectField';
import {db} from '../../firebase'
import { collection, addDoc } from 'firebase/firestore';
import { validateForm } from '../../utils/validate';
//import { registerUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog'; // Importar el Dialog
//import './register.css';

const roleOptions = [
  { label: 'Administrator', value: 'ADMIN' },
  { label: 'User', value: 'USER' },
];

const initialFormData = {
  email: '',
  age: '',
  name: '',
  lastName: '',
  password: '',
  rol: 'ADMIN',
};
const usersCollection = collection(db, 'Users');
export const RegisterForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false); // Estado para mostrar el Dialog
  const [dialogMessage, setDialogMessage] = useState(''); // Mensaje para el dialog
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleRoleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      rol: e.value,
    }));
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    navigate('/login');
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, name, lastName,age , rol, password } = formData;



    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      console.log(validationErrors);
      setErrors(validationErrors);
      return;
    }
   

    setIsLoading(true);
    try {
      //const response = await registerUser(formData);

      await addDoc(usersCollection, {
        email,
        name,
        lastName,
        password,
        age,
        rol,
      })
      const dialogMessage = `User ${name} created successfully`;
      setDialogMessage(dialogMessage); 
      setShowDialog(true);
      navigate('/login');
    } catch (error) {
      setDialogMessage(error.message || 'An error occurred'); // Mensaje de error
      setShowDialog(true); // Mostrar el dialog
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='form'>
      <Card style={{ width: '100%', maxWidth: '32rem' }}>
        <h2>
          Create Account
        </h2>
        {errors.server && (
          <Message 
            severity="error" 
            text={errors.server}
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className='grid'>
            <InputField
              id="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              icon={<User size={20} />}
              placeholder="Juan"
            />
            <InputField
              id="age"
              label="Age"
              value={formData.age}
              onChange={handleChange}
              error={errors.lastName}
            
              placeholder="20"
            />

            <InputField
              id="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              icon={<User size={20} />}
              placeholder="Pérez"
            />
          </div>

          <InputField
            id="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={<Mail size={20} />}
            type="email"
            placeholder="usuario1@example.com"
          />

          <InputField
            id="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.identification}
            icon={<Lock size={20} />}
            placeholder="12345678"
            type="password"

          />
         

          <SelectField
            id="rol"
            label="Role"
            value={formData.rol}
            onChange={handleRoleChange}
            options={roleOptions}
            error={errors.rol}
          />

          <Button
            type="submit"
            label="Create Account"
            icon="pi pi-user-plus"
            loading={isLoading}
            style={{ width: '100%' }}
          />

          <p style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#4b5563'
          }}>
            Already have an account?{' '}
            <a 
              href="/login"
              style={{ 
                fontWeight: '500',
                color: '#4f46e5',
                textDecoration: 'none'
              }}
            >
              Sign in
            </a>
          </p>
        </form>
      </Card>

      {/* Dialog de respuesta */}
      <Dialog
        visible={showDialog}
        style={{ width: '450px' }}
        header="Registration Status"
        modal
        onHide={() => setShowDialog(false)}
      >
        <p>{dialogMessage}</p>
        <Button label="Close" icon="pi pi-times" onClick={() => handleDialogClose()} />
      </Dialog>
    </div>
  );
};