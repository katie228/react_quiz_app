import { Link } from "react-router-dom";
import logo from "../assets/images/logo-bg.png";
import classes from "../styles/Nav.module.css";
import Account from "./Account";

export default function Nav() {
  return (
    <nav className={classes.nav}>
      <ul>
        <li>
          <Link to="/" className={classes.brand}>
            <img src={logo} alt="QuiZZZy" />
            <h3>QuiZZZy</h3>
          </Link>
        </li>
      </ul>
      <Account />
<<<<<<< HEAD
=======

>>>>>>> f6e75957decb6baee28d30473b81ce07860eebb7
    </nav>
  );
}
