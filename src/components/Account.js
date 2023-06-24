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

  const handleStudentRegistration = () => {
    history.push("/streg");
  };

  return (
    <div className={classes.account}>
      {currentUser ? (
        <>
          {currentUser.role !== "student" && (
            <span
              className={`${classes.icon} material-icons-outlined`}
              title="Регистрация студентов"
              onClick={handleStudentRegistration}
            >
              person_add
            </span>
          )}

          <Button onClick={handleResForTeacher}>Результаты</Button>

          <Button onClick={handleHome}>Тесты</Button>

          {/* Показать кнопку "Новый тест" только если роль пользователя не является 'student' */}
          {currentUser.role !== "student" && (
            <Button onClick={handleCreatent}>Новый тест</Button>
          )}

          <span
            className={`${classes.icon} material-icons-outlined`}
            title="Account"
          >
            account_circle
          </span>
          <span>{currentUser.displayName}</span>
          <span
            className={`${classes.icon} material-icons-outlined`}
            title="Выйти из аккаунта"
            onClick={logout}
          >
            logout
          </span>
        </>
      ) : (
        <>
          <Button onClick={handleSignUp}>Регистрация</Button>
          {/*это убрать потом чтобы только админ мог регистрировать*/}
          <Button onClick={handleLogin}>Вход</Button>
        </>
      )}
    </div>
  );
}
