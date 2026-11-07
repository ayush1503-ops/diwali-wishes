import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateWish from "./pages/CreateWish";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyWishes from "./pages/MyWishes";
import AdminDashboard from "./pages/AdminDashboard";
import GreetingCard from "./pages/GreetingCard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateWish />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-wishes" element={<MyWishes />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/wish/:slug" element={<GreetingCard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
