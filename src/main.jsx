import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import { PrimeReactProvider } from "primereact/api";
//import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <PrimeReactProvider>
  <BrowserRouter>
  <StrictMode>
    <App />
  </StrictMode>,
  </BrowserRouter>
  </PrimeReactProvider>
)
