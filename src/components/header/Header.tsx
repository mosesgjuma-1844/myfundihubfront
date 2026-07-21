import React, { useState, useEffect } from "react";
import "./Header.css";
import logoLight from "../../assets/images/Logo.png";
import logoDark from "../../assets/images/logowhite.jpeg";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('fundiTheme') : null;
    return savedTheme === 'light' ? 'light' : 'dark';
  });
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fundiTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleBookService = () => {
    closeMenu();
    navigate("/register");
  };

  const handleLogin = () => {
    closeMenu();
    navigate("/login");
  };


  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="header-container">
        <a href="/" className="header-logo" onClick={closeMenu}>
          <img
            src={theme === 'light' ? logoLight : logoDark}
            alt="myFundi Hub Logo"
            className="logo-image"
          />
          <span className="logo-text">myFundi</span>
          <span className="logo-suffix">Hub</span>
        </a>

        <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
          {/* Mobile: Book a Service button at top */}
          <button className="btn btn-book-service btn-mobile-top" onClick={handleBookService} type="button">
            <span className="book-icon">🔧</span>
            Book a Service
          </button>



          <div className="nav-actions">
            <div className="emergency-support">
              <div className="support-label">Emergency Support</div>
              <a href="tel:+254799160014" className="contact-phone">
                <span className="phone-icon"></span>
                <span>+254 799 160 014</span>
              </a>
            </div>
            
            <div className="mobile-action-buttons">
              <button className="btn btn-outline" onClick={handleLogin} type="button">
                Log In
              </button>
              <button className="btn theme-toggle-btn" type="button" onClick={toggleTheme}>
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
        </nav>

        {/* Desktop: Primary actions */}
        <div className="header-actions">
          <a href="tel:+254799160014" className="contact-phone-desktop">
            <span className="phone-icon">📞</span>
            <span className="phone-text">+254 799 160 014</span>
          </a>
          
          <button className="btn theme-toggle-btn" type="button" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <button className="btn btn-outline" onClick={handleLogin} type="button">
            Log In
          </button>         

        </div>

        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle Menu"
          type="button"
        >
          {menuOpen ? (
            <span className="close-icon">✕</span>
          ) : (
            <>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </>
          )}
        </button>
      </div>

      <div
        className={`mobile-overlay ${menuOpen ? "active" : ""}`}
        onClick={closeMenu}
      ></div>
    </header>
  );
};

export default Header;