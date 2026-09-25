import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import AuthButton from "../components/auth/AuthButton";
import AuthTextField from "../components/auth/AuthTextField";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const trimmedEmail = email.trim();
  const isEmailValid = EMAIL_PATTERN.test(trimmedEmail);
  const isPasswordValid = password.length >= 8;
  const isPasswordConfirmValid =
    passwordConfirm !== "" && password === passwordConfirm;

  const emailError =
    email !== "" && !isEmailValid
      ? "올바른 이메일 형식을 입력해주세요."
      : undefined;

  const passwordError =
    password !== "" && !isPasswordValid
      ? "비밀번호는 8자 이상이어야 합니다."
      : undefined;

  const passwordConfirmError =
    passwordConfirm !== "" && !isPasswordConfirmValid
      ? "비밀번호가 일치하지 않습니다."
      : undefined;

  const canSubmit = isEmailValid && isPasswordValid && isPasswordConfirmValid;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-blue-01 px-6 font-sans">
      <form
        className="flex w-full max-w-140 flex-col gap-10"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="flex flex-col gap-4">
          <AuthTextField
            id="signup-email"
            label="이메일"
            type="email"
            value={email}
            placeholder="이메일을 입력하세요"
            autoComplete="email"
            errorMessage={emailError}
            onChange={setEmail}
          />

          <AuthTextField
            id="signup-password"
            label="비밀번호"
            type="password"
            value={password}
            placeholder="비밀번호를 입력하세요"
            autoComplete="new-password"
            errorMessage={passwordError}
            onChange={setPassword}
          />

          <AuthTextField
            id="signup-password-confirm"
            label="비밀번호 확인"
            type="password"
            value={passwordConfirm}
            placeholder="비밀번호를 다시 입력하세요"
            autoComplete="new-password"
            errorMessage={passwordConfirmError}
            onChange={setPasswordConfirm}
          />
        </div>

        <div className="flex flex-col items-center gap-7">
          <AuthButton disabled={!canSubmit}>회원가입</AuthButton>

          <p className="text-body-medium font-regular text-gray-03">
            이미 계정이 있으신가요?{" "}
            <Link className="font-bold text-blue-05" to="/login">
              로그인
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}

export default SignupPage;
