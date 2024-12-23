import { Button } from 'primereact/button';
import { InputOtp } from 'primereact/inputotp';
import { db } from '../../firebase';
import { useParams } from 'react-router-dom';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export const Otp = ({ token, setTokens }) => {
    const [user, setUser] = useState(null); // Estado para guardar los datos del usuario
    const { userName, password } = useParams(); // Obtiene parámetros de la URL

    const getUserByEmail = async () => {
        try {
            // Realiza la consulta para buscar por email
            const usersRef = collection(db, 'Users'); // Reemplaza 'users' con el nombre de tu colección
            const q = query(usersRef, where('email', '==', userName)); // Busca el email en el campo 'email'
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    console.log("Document data:", doc.data());
                    setUser(doc.data()); // Guarda los datos en el estado
                });
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    useEffect(() => {
        getUserByEmail(); // Llama a la función para obtener datos al montar el componente
    }, [userName]); // Se ejecuta cuando 'userName' cambia (es decir, cuando el email cambia)

    return (
        <div className="flex flex-column align-items-center">
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
            {user && (
                <div className="mt-4">
                    <h3>Datos del usuario:</h3>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};
