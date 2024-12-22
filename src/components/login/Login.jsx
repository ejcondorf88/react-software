import { useState } from 'react'; // Importar useState
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { User, Lock } from 'lucide-react'; // Íconos para username y password
import { InputField } from '../form/InputField';
import { Otp } from '../otp/Otp';

export const LoginForm = () => {
    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    }); // Estado para manejar los datos del formulario

    const [errors, setErrors] = useState({
        userName: '',
        password: ''
    }); // Estado para los errores

    const [showOtpScreen, setShowOtpScreen] = useState(false); // Controla si se muestra la pantalla de OTP

    const [otp, setOtp] = useState(''); // Maneja el OTP ingresado
    const [otpError, setOtpError] = useState(''); // Maneja errores de OTP

    const isLoading = false; // Indicador de carga (falso por defecto)

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value // Actualiza dinámicamente el campo correspondiente
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            userName: formData.userName ? '' : 'Username is required',
            password: formData.password ? '' : 'Password is required'
        };

        setErrors(newErrors);

        if (!newErrors.userName && !newErrors.password) {
            // Simular envío exitoso y mostrar pantalla de OTP
            setShowOtpScreen(true);
        }
    };

 

    return (
        <div className="login-container">
            <Card className="login-card">
                {!showOtpScreen ? (
                    // Vista del formulario de inicio de sesión
                    <>
                        <div className="login-header">
                            <h2>Welcome Back</h2>
                            <p>Please sign in to continue</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            <InputField
                                id="userName"
                                label="Username"
                                value={formData.userName}
                                onChange={handleChange}
                                error={errors.userName} // Muestra error específico si existe
                                icon={<User size={20} />}
                                type="text"
                                placeholder="Enter your username"
                            />

                            <InputField
                                id="password"
                                label="Password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password} // Muestra error específico si existe
                                icon={<Lock size={20} />}
                                type="password"
                                placeholder="Enter your password"
                            />

                            <div className="login-options">
                                <a href="/forgot-password" className="forgot-password">
                                    Forgot Password?
                                </a>
                            </div>

                            <Button
                                type="submit"
                                label="Sign In"
                                icon="pi pi-sign-in"
                                loading={isLoading}
                                className="login-button"
                            />

                            <p className="signup-link">
                                Don't have an account?{' '}
                                <a href="/register">Create one now</a>
                            </p>
                        </form>
                    </>
                ) : (
                    // Vista de la pantalla de OTP
                    <>
            
                       <Otp token={otp} setTokens={setOtp} />
                    </>
                )}
            </Card>
        </div>
    );
};
