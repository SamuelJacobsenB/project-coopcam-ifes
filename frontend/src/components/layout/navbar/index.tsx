import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { I } from "../../";
import { navRoutes } from "../../../routes";
import { logo } from "../../../assets";

import styles from "./styles.module.css";

export function Navbar() {
  const location = useLocation(); // Hook para detectar mudança de rota
  const activeRoute = location.pathname;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.logoContainer}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </Link>

        <div className={styles.menuRight}>
          <ul className={styles.links}>
            {navRoutes.map((route) => (
              <li key={route.path}>
                <Link
                  className={`${styles.link} ${
                    activeRoute === route.path ? styles.active : ""
                  }`}
                  to={route.path}
                >
                  {route.label}
                  {activeRoute === route.path && (
                    <span className={styles.indicator} />
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <button className={styles.profileBtn} aria-label="Perfil">
            <I.user className={styles.profileIcon} />
          </button>

          <div className={styles.menuBurguer}>
            <button
              className={styles.menuBtn}
              aria-label="Menu"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <I.close className={styles.menuIcon} />
              ) : (
                <I.menu className={styles.menuIcon} />
              )}
            </button>

            {isOpen && (
              <div className={styles.menu}>
                <ul className={styles.menuList}>
                  {navRoutes.map((route) => (
                    <li key={route.path}>
                      <Link
                        className={`${styles.link} ${
                          activeRoute === route.path ? styles.active : ""
                        }`}
                        to={route.path}
                      >
                        {route.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
