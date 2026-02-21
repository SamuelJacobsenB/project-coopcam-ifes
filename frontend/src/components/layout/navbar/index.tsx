import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ConfirmModal, I } from "../../";
import { logo } from "../../../assets";
import { useLogout } from "../../../hooks";
import { navRoutes } from "../../../routes";

import styles from "./styles.module.css";

export function Navbar() {
  const navigate = useNavigate();

  const { logout } = useLogout();

  const location = useLocation();
  const activeRoute = location.pathname;

  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className={styles.logoutBtn}
          >
            <I.user className={styles.profileIcon} />
            <I.logout className={styles.logoutIcon} />
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

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen((val) => !val)}
        onConfirm={async () => {
          await logout();
          navigate("/login");
        }}
        title="Logout"
        description="Você realmente deseja sair de sua conta?"
      />
    </header>
  );
}
