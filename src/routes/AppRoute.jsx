
import { Route, Routes } from 'react-router-dom';
import { LoginForm } from '../components/login/Login';
import { Otp } from '../components/otp/Otp';
import { RegisterForm } from '../components/regiter/Register';
import { Dashboard } from '../components/dashboard/Dashboard';
import { Create } from '../components/create/Create';
import { Profile } from '../components/profile/Profile';

export const AppRoute = () => (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/all-flats" element={<h1>All Flats</h1>} />
        <Route path="/favorites" element={<h1>Favorites Flats</h1>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create" element={<Create />} />
        <Route path="/edit/:id" element={<h1>Edit</h1>} />
        <Route path="/view/:id" element={<h1>View</h1>} />
        <Route path="*" element={<h1>404</h1>} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );