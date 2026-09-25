import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import loginDivider from "../assets/login-divider.svg";
import AuthTextField from "../components/auth/AuthTextField";
import AuthButton from "../components/auth/AuthButton";

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
          <AuthTextField
            id="login-email"
            label="아이디"
            type="email"
            value={email}
            placeholder="아이디를 입력하세요"
            autoComplete="email"
            onChange={setEmail}
          />

          <AuthTextField
            id="login-password"
            label="비밀번호"
            type="password"
            value={password}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            onChange={setPassword}
          />
        </div>

        <div className="flex flex-col items-center gap-7">
          <AuthButton disabled={!canSubmit}>로그인</AuthButton>
          <nav
            className="flex items-center justify-center gap-8 text-body-small font-regular text-gray-03"
            aria-label="계정 도움말"
          >
            <Link to="/signup">회원가입</Link>
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
