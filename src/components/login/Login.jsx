import { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { User, Lock } from 'lucide-react';
import { InputField } from '../form/InputField';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const LoginForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        userName: '',
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            userName: formData.userName ? '' : 'Username is required',
            password: formData.password ? '' : 'Password is required'
        };

        setErrors(newErrors);

        if (newErrors.userName || newErrors.password) {
            return;
        }

        // Simula la validación de inicio de sesión
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            login(formData);
            // Eliminado print()
            navigate('/otp', {
                state: {
                    userName: formData.userName,
                    password: formData.password
                }
            });
        }, 1000);
    };

    return (
        <div className="login-container">
            <Card className="login-card">
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
                        error={errors.userName}
                        icon={<User size={20} />}
                        type="text"
                        placeholder="Enter your username"
                    />

                    <InputField
                        id="password"
                        label="Password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        icon={<Lock size={20} />}
                        type="password"
                        placeholder="Enter your password"
                    />

                    <div className="login-options">
                        <Link to="/forgot-password" className="forgot-password">
                            Forgot Password?
                        </Link>
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
                        <Link to="/register">Create one now</Link>
                    </p>
                </form>
            </Card>
        </div>
    );
};