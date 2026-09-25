import { useState, type FormEvent } from "react";

import loginDivider from "../assets/login-divider.svg";
import LoginButton from "../components/auth/LoginButton";
import LoginTextField from "../components/auth/LoginTextField";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = email.trim() !== "" && password !== "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-blue-01 px-6 font-sans">
      <form
        className="flex w-full max-w-140 flex-col gap-10"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4">
          <LoginTextField
            id="login-email"
            fieldType="id"
            value={email}
            onChange={setEmail}
          />
          <LoginTextField
            id="login-password"
            fieldType="password"
            value={password}
            onChange={setPassword}
          />
        </div>

        <div className="flex flex-col items-center gap-7">
          <LoginButton disabled={!canSubmit} />

          <nav
            className="flex items-center justify-center gap-8 text-body-small font-regular text-gray-03"
            aria-label="계정 도움말"
          >
            <button type="button">회원가입</button>
            <img className="h-5.5 w-px" src={loginDivider} alt="" />
            <button type="button">아이디 찾기</button>
            <img className="h-5.5 w-px" src={loginDivider} alt="" />
            <button type="button">비밀번호 찾기</button>
          </nav>
        </div>
      </form>
    </main>
  );
}

export default LoginPage;
