import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function signOut() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link className="logo" to="/">Nova<span>Tech</span></Link>
      <nav className="navbar-links">
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/about">About us</NavLink>
        {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
      </nav>
      <div className="nav-actions">
        {user ? (
          <>
            <span className="user-greeting">Hi, {user.name}</span>
            <button className="btn btn-small btn-outline" onClick={signOut}>Logout</button>
          </>
        ) : (
          <>
            <Link className="nav-login" to="/login">Login</Link>
            <Link className="btn btn-small btn-primary" to="/register">Sign up</Link>
          </>
        )}
      </div>
    </header>
  );
}
