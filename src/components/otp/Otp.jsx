import { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../firebase'; // Ajusta la ruta según sea necesario

export const Otp = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [error, setError] = useState(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  useEffect(() => {
    // Inicializa reCAPTCHA cuando el componente se monta
    initializeRecaptcha();
    return () => {
      // Limpia recaptcha cuando el componente se desmonta
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  }, []);  // Solo se ejecuta al montar el componente

  const initializeRecaptcha = async () => {
    try {
      // Limpiar cualquier verificador existente si es necesario
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }

      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA resuelto, habilitar el botón de verificación
          console.log('reCAPTCHA verificado');
        },
        'expired-callback': () => {
          // Resetear reCAPTCHA cuando expire
          setError('reCAPTCHA expirado. Por favor resuélvelo de nuevo.');
          initializeRecaptcha();
        }
      });

      await verifier.render();
      setRecaptchaVerifier(verifier);
    } catch (err) {
      console.error('Error al inicializar reCAPTCHA:', err);
      setError('No se pudo inicializar el sistema de verificación. Por favor recarga la página.');
    }
  };

  const initializeUser = async () => {
    try {
      setError(null);
      
      if (!phoneNumber) {
        throw new Error('No se proporcionó un número de teléfono');
      }

      if (!recaptchaVerifier) {
        throw new Error('El sistema de verificación no está inicializado');
      }

      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      
      // Asegúrate de que el número esté en el formato correcto
      if (!formattedPhoneNumber.startsWith('+')) {
        throw new Error('Formato de número de teléfono inválido');
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        recaptchaVerifier
      );

      setVerificationId(confirmationResult.verificationId);
    } catch (err) {
      console.error('Error durante la inicialización:', err);
      setError(err.message || 'Ocurrió un error. Por favor inténtalo de nuevo.');
    }
  };

  const formatPhoneNumber = (number) => {
    // Limpiar el número de teléfono para incluir solo dígitos y asegurar el formato correcto
    const cleaned = number.replace(/\D/g, '');
    return `+${cleaned}`;
  };

  return (
    <div className="p-4">
      {/* Contenedor de reCAPTCHA */}
      <div id="recaptcha-container" className="mb-4"></div>
      
      {/* Mostrar mensaje de error si hay algún error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Campo de entrada para el número de teléfono */}
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Ingresa el número de teléfono"
        className="border p-2 rounded mb-4 w-full"
      />

      {/* Botón para enviar el código de verificación */}
      <button
        onClick={initializeUser}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={!recaptchaVerifier || !phoneNumber}
      >
        Enviar código de verificación
      </button>

      {/* Mostrar mensaje de confirmación cuando el OTP sea enviado */}
      {verificationId && (
        <div className="mt-4">
          <p className="text-green-600">¡Código de verificación enviado!</p>
          {/* Aquí puedes agregar los campos para ingresar el OTP */}
        </div>
      )}
    </div>
  );
};
