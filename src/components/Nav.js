import { Link } from "react-router-dom";
import logo from "../assets/images/logo-bg.png";
import classes from "../styles/Nav.module.css";
import Account from "./Account";

export default function Nav() {
  return (
    <nav className={classes.nav}>
      <ul className={classes.navList}>
        <li>
          <Link to="/" className={classes.brand}>
            <img src={logo} alt="QuiZZZy" />
            <h3>QuiZZZy</h3>
          </Link>
        </li>
      </ul>
      <Account />
    </nav>
  );
}
