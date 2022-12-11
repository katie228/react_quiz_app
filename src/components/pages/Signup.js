import Illustration from "../Illustration";
import SignupForm from "../SignupForm";

export default function Signup() {
  return (
    <>
      <h1>Создание аккаунта</h1>
      <div className="column">
        <Illustration />
        <SignupForm />
      </div>
    </>
  );
}
