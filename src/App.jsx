import { Route, Routes } from 'react-router-dom';
// import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<h1>Login</h1>} />
        <Route path="/register" element={<h1>Register</h1>} />
        <Route path="/all-flats" element={<h1>All Flats</h1>} />
        <Route path="/favorites" element={<h1>Favorites Flats</h1>} />
        <Route path="/profile" element={<h1>Profile</h1>} />
        <Route path="/create" element={<h1>Create</h1>} />
        <Route path="/edit/:id" element={<h1>Edit</h1>} />
        <Route path="/view/:id" element={<h1>View</h1>} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </div>
  );
}

export default App;
