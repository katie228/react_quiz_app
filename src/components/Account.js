import { useHistory } from "react-router-dom";
import Button from "../components/Button.js";
import { useAuth } from "../contexts/AuthContext";
import classes from "../styles/Account.module.css";

export default function Account() {
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  const handleResForTeacher = () => {
    history.push("/resforteacher");
  };

  const handleSignUp = () => {
    history.push("/signup");
  };

  const handleLogin = () => {
    history.push("/login");
  };

  const handleHome = () => {
    history.push("/home");
  };

  const handleCreatent = () => {
    history.push("/creatent");
  };

  return (
    <div className={classes.account}>
      {currentUser ? (
        <>
          <ul>
            <li>
              <Button onClick={handleResForTeacher}>Результаты</Button>
            </li>
          </ul>

          <ul>
            <li>
              <Button onClick={handleHome}>Тесты</Button>
            </li>
          </ul>

          <ul>
            <li>
              <Button onClick={handleCreatent}>Новый тест</Button>
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
          <Button onClick={handleSignUp}>Регистрация</Button>
          <Button onClick={handleLogin}>Вход</Button>
        </>
      )}
    </div>
  );
}
