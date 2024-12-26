import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';

export const Otp = () => {
    const location = useLocation();
    const { userName, password } = location.state || {};
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(['', '', '', '', '', '']);

    const formatPhoneNumber = (phone) => {
        const cleanPhone = phone.startsWith('0') ? phone.substring(1) : phone;
        return `+593${cleanPhone}`;
    };

    const initializeRecaptcha = async () => {
        try {
            // Limpiar instancia anterior si existe
            if (window.recaptchaVerifier) {
                await window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }

            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: () => {
                    console.log('reCAPTCHA verificado exitosamente');
                },
                'expired-callback': () => {
                    setError('reCAPTCHA expirado. Por favor, intente de nuevo.');
                }
            });

            // Pre-render reCAPTCHA
            await window.recaptchaVerifier.render();
            
        } catch (error) {
            console.error('Error al inicializar reCAPTCHA:', error);
            setError('Error al inicializar reCAPTCHA. Por favor, recargue la página.');
            throw error;
        }
    };

    const sendOtp = async (phone) => {
        try {
            setLoading(true);
            const formattedPhone = formatPhoneNumber(phone);
            console.log('Enviando OTP al número:', formattedPhone);

            await initializeRecaptcha();
            const appVerifier = window.recaptchaVerifier;

            const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            window.confirmationResult = confirmationResult;
            console.log('OTP enviado exitosamente');
            
        } catch (error) {
            console.error('Error al enviar OTP:', error);
            setError('Error al enviar el código. Por favor, intente de nuevo en unos momentos.');
            
            if (window.recaptchaVerifier) {
                await window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        const otpCode = token.join('');
        if (!otpCode || otpCode.length !== 6) {
            setError('Por favor ingrese un código válido de 6 dígitos');
            return;
        }

        try {
            setLoading(true);
            const confirmationResult = window.confirmationResult;
            if (!confirmationResult) {
                throw new Error('No se encontró resultado de confirmación');
            }

            const result = await confirmationResult.confirm(otpCode);
            console.log('Número de teléfono verificado exitosamente:', result.user);

            if (user) {
                navigate('/dashboard', { state: { user } });
            } else {
                navigate('/register', { state: { userName, password } });
            }
        } catch (error) {
            console.error('Error al verificar OTP:', error);
            setError('Código inválido. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (index, value) => {
        const newToken = [...token];
        newToken[index] = value;
        setToken(newToken);

        // Mover al siguiente input si hay valor
        if (value && index < 5) {
            const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
            if (nextInput) nextInput.focus();
        }
    };

    const getUserByEmail = async () => {
        if (!userName || !password) {
            setError('Credenciales no proporcionadas');
            return;
        }

        setLoading(true);
        try {
            const usersRef = collection(db, 'Users');
            const q = query(usersRef, where('email', '==', userName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                console.log('Datos del usuario:', userData);

                if (userData.password !== password) {
                    throw new Error('Contraseña inválida');
                }

                if (!userData.phone) {
                    throw new Error('No hay número de teléfono disponible para este usuario');
                }

                setUser(userData);
                await sendOtp(userData.phone);
            } else {
                throw new Error('No se encontró usuario con el correo proporcionado');
            }
        } catch (error) {
            console.error('Error en getUserByEmail:', error);
            setError(error.message || 'Ocurrió un error. Por favor, intente de nuevo.');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserByEmail();
    }, [userName]);


    const header = (
        <div className="text-center p-3">
            <h2 className="text-2xl font-bold m-0">Verificación en dos pasos</h2>
        </div>
    );

    return (
        <div className="flex align-items-center justify-content-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full md:w-30rem" header={header}>
                <div id="recaptcha-container"></div>

                <div className="flex flex-column gap-4">
                    {error && (
                        <Message 
                            severity="error" 
                            text={error}
                            className="w-full"
                        />
                    )}

                    {loading ? (
                        <div className="flex justify-content-center p-4">
                            <ProgressSpinner 
                                style={{width: '50px', height: '50px'}}
                                strokeWidth="4"
                                animationDuration=".5s"
                            />
                        </div>
                    ) : user ? (
                        <div className="flex flex-column gap-4">
                            <p className="text-center text-gray-600 m-0">
                                Por favor ingrese el código enviado al número
                                <span className="font-bold"> ****{user.phone?.slice(-4)}</span>
                            </p>

                            <div className="flex justify-content-center gap-2">
                                {token.map((digit, index) => (
                                    <InputText
                                        key={index}
                                        name={`otp-${index}`}
                                        value={digit}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        className="w-4rem h-4rem text-center text-xl"
                                        maxLength={1}
                                        keyfilter="int"
                                        autoComplete="off"
                                    />
                                ))}
                            </div>

                            <div className="flex flex-column gap-2">
                                <Button 
                                    label={loading ? 'Verificando...' : 'Verificar código'}
                                    icon={loading ? 'pi pi-spinner pi-spin' : 'pi pi-check'}
                                    onClick={verifyOtp}
                                    disabled={loading || token.some(digit => !digit)}
                                    className="w-full"
                                />

                                <Button
                                    label="Reenviar código"
                                    icon="pi pi-refresh"
                                    onClick={() => getUserByEmail()}
                                    disabled={loading}
                                    severity="secondary"
                                    text
                                    className="w-full"
                                />
                            </div>
                        </div>
                    ) : (
                        <Message 
                            severity="info" 
                            text="No se encontró usuario. Por favor, verifique sus credenciales."
                            className="w-full"
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Otp;