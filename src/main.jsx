import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // Solo necesitas HashRouter
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import { AppRoute } from './routes/AppRoute.jsx';
import { PrimeReactProvider } from "primereact/api";
import './index.css';
import './App.css';
import { AuthProvider } from './context/AuthProvider'; // Cambiado para importar desde AuthProvider.jsx

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <PrimeReactProvider>
        <HashRouter>
          <AppRoute />
        </HashRouter>
      </PrimeReactProvider>
    </AuthProvider>
  </StrictMode>
);