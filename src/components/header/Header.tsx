import { useState } from "react";
import logo from "../../assets/logo2.png";
import "./header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="header">
        <div className="header-top">
            <img src={logo} alt="Logo" />

            <button
            className={`menu-toggle ${isMenuOpen ? "menu-open" : ""}`}
            type="button"
            aria-label={isMenuOpen ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            aria-controls="main-navigation"
            onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
            >
            <span />
            <span />
            <span />
            </button>
        </div>

        <nav id="main-navigation" className={isMenuOpen ? "nav-open" : ""}>
            <ul>
            <li>
                <a href="/#home" onClick={closeMenu}>
                Home
                </a>
            </li>
            <li>
                <a href="/#about" onClick={closeMenu}>
                About
                </a>
            </li>
            <li>
                <a href="/#projects" onClick={closeMenu}>
                Projects
                </a>
            </li>
            <li>
                <a href="/#contact" onClick={closeMenu}>
                Contact
                </a>
            </li>
            </ul>
        </nav>
    </div>
  );
}

export default Header;
