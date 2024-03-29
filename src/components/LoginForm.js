import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "./Button";
import Form from "./Form";
import TextInput from "./TextInput";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState();
  const [loading, setLoading] = useState();

  const { login } = useAuth();
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      history.push("/home");
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError("Ошибка входа!");
    }
  }
  return (
    <Form style={{ height: "330px" }} onSubmit={handleSubmit}>
      <TextInput
        type="text"
        placeholder="Введите E-mail"
        icon="alternate_email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextInput
        type="password"
        placeholder="Введите пароль"
        icon="lock"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button type="submit" disabled={loading}>
        <span>Подтвердить</span>
      </Button>

      {error && <p className="error">{error}</p>}

      <div className="info">
        У вас ещё нет аккаунта? <Link to="/signup">Создать.</Link>
      </div>
    </Form>
  );
}
