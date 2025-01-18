import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import { AppRoute } from './routes/AppRoute.jsx';
import { PrimeReactProvider } from "primereact/api";
import './index.css'
import './App.css'
import { AuthProvider } from './context/AuthProvider';  // Cambiado para importar desde AuthProvider.jsx

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <PrimeReactProvider>
        <BrowserRouter>
          <AppRoute />
        </BrowserRouter>
      </PrimeReactProvider>
    </AuthProvider>
  </StrictMode>
)