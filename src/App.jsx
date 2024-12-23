import { Route, Routes } from 'react-router-dom';
import { LoginForm } from './components/login/Login';
 import './App.css';
import { Otp } from './components/otp/Otp';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<h1>Register</h1>} />
        <Route path="/all-flats" element={<h1>All Flats</h1>} />
        <Route path="/favorites" element={<h1>Favorites Flats</h1>} />
        <Route path="/profile" element={<h1>Profile</h1>} />
        <Route path="/create" element={<h1>Create</h1>} />
        <Route path="/edit/:id" element={<h1>Edit</h1>} />
        <Route path="/view/:id" element={<h1>View</h1>} />
        <Route path="*" element={<h1>404</h1>} />
        <Route path="/otp/:userName" element={<Otp />} />
      </Routes>
    </div>
  );
}

export default App;
