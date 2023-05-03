import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import classes from "../styles/Account.module.css";

export default function Account() {
  const { currentUser, logout } = useAuth();
  return (
    <div className={classes.account}>
      {currentUser ? (
        <>
          <ul>
            <li>
              <Link to="/home" className={classes.home}>
                <h3>Тесты</h3>
              </Link>
            </li>
          </ul>

          <ul>
            <li>
              <Link to="/creatent" className={classes.creatent}>
                <h3>Создать новый тест</h3>
              </Link>
            </li>
          </ul>

          <span className="material-icons-outlined" title="Account">
            account_circle
          </span>
          <span>{currentUser.displayName}</span>
          <span
            className="material-icons-outlined"
            title="Logout"
            onClick={logout}
          >
            {" "}
            logout{" "}
          </span>
        </>
      ) : (
        <>
          <Link to="/signup">Регистрация</Link>
          <Link to="/login">Вход</Link>
        </>
      )}
    </div>
  );
}
