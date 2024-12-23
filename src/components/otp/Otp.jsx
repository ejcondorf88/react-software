import { Button } from 'primereact/button';
import { InputOtp } from 'primereact/inputotp';
import { db } from '../../firebase';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const Otp = ({ token, setTokens }) => {
    const location = useLocation();
    const { userName, password } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const getUserByEmail = async () => {
        setLoading(true); // Inicia el estado de carga
        try {
            const usersRef = collection(db, 'Users'); // Reemplaza 'Users' con el nombre de tu colección
            const q = query(usersRef, where('email', '==', userName)); // Busca el email en el campo 'email'
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data(); 
                if(userData.password !== password){
                    console.log({password},{userData})
                    console.log("No user found with the provided email.");
                    return
                }// Obtén el primer documento
                setUser(userData);
                console.log(userData); // Guarda los datos en el estado
            } else {
                setUser(null); // Limpia el estado si no se encuentra
                console.log("No user found with the provided email.");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    };

    useEffect(() => {
        getUserByEmail(); // Llama a la función para obtener datos al montar el componente
    }, [userName]); // Se ejecuta cuando 'userName' cambia

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-column align-items-center">
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
                        <Button label="Resend Code" link className="p-0"></Button>
                        <Button label="Submit Code"></Button>
                    </div>
                </>
            ) : (
                <p>No user found. Please check the email and try again.</p>
            )}
        </div>
    );
};
