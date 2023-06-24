import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "./Button";
import Checkbox from "./Checkbox";
import Form from "./Form";
import TextInput from "./TextInput";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState("");
  const [role, setRole] = useState("");

  const [error, setError] = useState();
  const [loading, setLoading] = useState();

  const { signup } = useAuth();
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    // Валидация
    if (password !== confirmPassword) {
      return setError("Пароли не совпадают, попробуйте ещё раз:)");
    }

    if (!role) {
      return setError("Выберите роль пользователя.");
    }

    try {
      setError("");
      setLoading(true);
      await signup(email, password, username, role);
      history.push("/");
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError("Ошибка создания аккаунта!");
    }
  }

  return (
    <Form style={{ height: "500px" }} onSubmit={handleSubmit}>
      <TextInput
        type="text"
        placeholder="Введите ФИО"
        icon="person"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextInput
        type="text"
        placeholder="Введите E-mail"
        icon="alternate_email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextInput
        type="password" // Изменен тип на "password"
        placeholder="Введите пароль"
        icon="lock"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextInput
        type="password" // Изменен тип на "password"
        placeholder="Подтвердите пароль"
        icon="lock_clock"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <div>
        <label>
          <Checkbox
            value={role}
            checked={role === "student"}
            onChange={() => setRole("student")}
          />
          Студент
        </label>
      </div>

      <Checkbox
        text="Я согласен с обработкой персональных данных."
        required
        value={agree}
        onChange={(e) => setAgree(e.target.value)}
      />
      <Button disabled={loading} type="submit">
        <span>Подтвердить</span>
      </Button>

      {error && <p className="error">{error}</p>}

      <div className="info">
        У вас уже есть аккаунт? <Link to="/login">Войти.</Link>.
      </div>
    </Form>
  );
}
