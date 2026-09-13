import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const links = [
  { to: '/', label: 'Početna' },
  { to: '/katalog', label: 'Katalog' },
  { to: '/omiljene', label: 'Omiljene' },
  { to: '/plan-sadnje', label: 'Plan sadnje' },
  { to: '/o-nama', label: 'O nama' },
  { to: '/kontakt', label: 'Kontakt' },
];

export function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand">
          🌱 Web Rasadnik
        </NavLink>

        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Otvori meni"
        >
          ☰
        </button>

        <nav className={`navbar__links ${menuOpen ? 'is-open' : ''}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <button className="navbar__theme" onClick={toggleTheme} title="Promeni temu">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <NavLink to="/korpa" className="navbar__cart">
            🛒
            {itemCount > 0 && <span className="navbar__cart-badge">{itemCount}</span>}
          </NavLink>

          {user ? (
            <button className="navbar__auth" onClick={handleLogout}>
              Odjava ({user.name.split(' ')[0]})
            </button>
          ) : (
            <NavLink to="/prijava" className="navbar__auth">
              Prijava
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
