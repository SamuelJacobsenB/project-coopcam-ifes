import { memo, useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ConfirmModal, I } from "../../";
import { logo } from "../../../assets";
import { useLogout } from "../../../hooks";
import { navRoutes } from "../../../routes";

import styles from "./styles.module.css";

interface NavbarProps {
  readonly?: boolean;
}

const NavbarComponent = ({ readonly = false }: NavbarProps) => {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const location = useLocation();
  const activeRoute = location.pathname;

  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutConfirm = useCallback(async () => {
    await logout();
    navigate("/login");
  }, [logout, navigate]);

  const handleMobileMenuToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const renderNavLinks = useCallback(
    (closeMenu?: () => void) => (
      <ul className={styles.links}>
        {navRoutes.map((route) => (
          <li key={route.path}>
            <Link
              className={`${styles.link} ${
                activeRoute === route.path ? styles.active : ""
              }`}
              to={route.path}
              onClick={closeMenu}
            >
              {route.label}
              {activeRoute === route.path && (
                <span className={styles.indicator} aria-hidden="true" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    ),
    [activeRoute],
  );

  return (
    <header className={styles.header} role="banner">
      <nav className={styles.navbar} aria-label="Navegação principal">
        <Link to="/" className={styles.logoContainer} aria-label="Voltar à home">
          <img src={logo} alt="Logo CoopCam" className={styles.logo} />
        </Link>

        <div className={styles.menuRight}>
          {renderNavLinks()}

          {!readonly && (
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className={styles.logoutBtn}
              aria-label="Perfil e sair"
              type="button"
            >
              <I.user className={styles.profileIcon} />
              <I.logout className={styles.logoutIcon} />
            </button>
          )}

          <div className={styles.menuBurguer}>
            <button
              className={styles.menuBtn}
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              onClick={handleMobileMenuToggle}
              type="button"
            >
              {isOpen ? (
                <I.close className={styles.menuIcon} />
              ) : (
                <I.menu className={styles.menuIcon} />
              )}
            </button>

            {isOpen && (
              <div className={styles.menu} id="mobile-menu">
                {renderNavLinks(() => setIsOpen(false))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {!readonly && (
        <ConfirmModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen((val) => !val)}
          onConfirm={handleLogoutConfirm}
          title="Logout"
          description="Você realmente deseja sair de sua conta?"
        />
      )}
    </header>
  );
};

export const Navbar = memo(NavbarComponent);
