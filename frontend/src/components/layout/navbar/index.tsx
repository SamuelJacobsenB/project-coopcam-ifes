import { Link } from "react-router-dom";

import { I } from "../../";
import { navRoutes } from "../../../routes";
import { logo } from "../../../assets";

import styles from "./styles.module.css";

export function Navbar() {
  const activedRoute = window.location.pathname;

  return (
    <nav className={styles.navbar}>
      <Link to="/">
        <img src={logo} alt="logo" className={styles.logo} />
      </Link>
      <div className={styles.menu}>
        <ul className={styles.links}>
          {navRoutes.map((route) => {
            return (
              <li key={route.path}>
                <Link
                  className={`${styles.link} ${
                    activedRoute === route.path ? styles.actived : ""
                  }`}
                  to={route.path}
                >
                  {route.label}
                </Link>
              </li>
            );
          })}
        </ul>
        {<I.user className={styles.profile} />}
      </div>
    </nav>
  );
}
