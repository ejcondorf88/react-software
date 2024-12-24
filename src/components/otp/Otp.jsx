import { Button } from 'primereact/button';
import { InputOtp } from 'primereact/inputotp';
import { db,auth } from '../../firebase';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {  RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export const Otp = ({ token, setTokens }) => {
    const location = useLocation();
    const { userName, password } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    // Configuración de reCAPTCHA
    const onCaptchaVerify = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                'recaptcha-container',
                {
                    size: 'normal',
                    callback: () => {
                        console.log('ReCAPTCHA verified');
                    },
                    'expired-callback': () => {
                        console.log('ReCAPTCHA expired. Please try again.');
                    },
                },
                auth
            );
        }
    };

    // Envío del OTP al número de teléfono
    const onSignInSubmit = () => {
        if (!user || !user.phone) {
            console.error('Phone number not found for user.');
            return;
        }

        setLoading(true);
        onCaptchaVerify();

        const appVerifier = window.recaptchaVerifier;

        signInWithPhoneNumber(auth, `+57${user.phone}`, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                console.log('OTP sent successfully');
            })
            .catch((error) => {
                console.error('Error sending OTP:', error);
            })
            .finally(() => setLoading(false));
    };

    // Obtiene al usuario por correo electrónico desde Firestore
    const getUserByEmail = async () => {
        setLoading(true);
        try {
            const usersRef = collection(db, 'Users');
            const q = query(usersRef, where('email', '==', userName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                if (userData.password !== password) {
                    console.error('Invalid password');
                    return;
                }

                if (!userData.phone) {
                    console.error('Phone number not available for this user.');
                    return;
                }

                setUser(userData);
            } else {
                console.log('No user found with the provided email.');
                setUser(null);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserByEmail();
    }, [userName]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-column align-items-center" id="recaptcha-container">
            {user ? (
                <>
                    <p className="font-bold text-xl mb-2">Authenticate Your Account</p>
                    <p className="text-color-secondary block mb-5">
                        Please enter the code sent to your phone.
                    </p>
                    <InputOtp
                        value={token}
                        onChange={(e) => setTokens(e.value)}
                        length={6}
                        style={{ gap: 0 }}
                    />
                    <div className="flex justify-content-between mt-5 align-self-stretch">
                        <Button onClick={onSignInSubmit} label="Submit Code" />
                    </div>
                </>
            ) : (
                <p>No user found. Please check the email and try again.</p>
            )}
        </div>
    );
};
