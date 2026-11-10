import { Link, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function NotFound() {
  return <section className="section"><p className="eyebrow">404</p><h1>Page not found</h1><p><Link to="/">Return home</Link></p></section>;
}
export default function App() {
  return <>
    <Navbar />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <footer className="footer">
      <Link className="footer-logo" to="/">Nova<span>Tech</span></Link>
      <p>Technology for everyday possibilities.</p>
      <nav className="footer-nav" aria-label="Footer navigation">
        <Link to="/">Home</Link>
      </nav>
      <div className="footer-contact">
        <a href="tel:+250798755572">Call: 0798755572</a>
        <a href="https://wa.me/250798755572" target="_blank" rel="noreferrer">WhatsApp</a>
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
      </div>
      <small>© {new Date().getFullYear()} NovaTech. All rights reserved.</small>
    </footer>
  </>;
}
