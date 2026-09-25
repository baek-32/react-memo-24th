import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../api/auth";
import { ApiError } from "../api/client";
import loginDivider from "../assets/login-divider.svg";
import AuthButton from "../components/auth/AuthButton";
import AuthTextField from "../components/auth/AuthTextField";
import CommonModal from "../components/CommonModal";
import { useAuthStore } from "../stores/useAuthStore";

function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNetworkErrorModalOpen, setIsNetworkErrorModalOpen] =
    useState(false);

  const canSubmit =
    email.trim() !== "" && password !== "" && !isSubmitting;

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setLoginError(null);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setLoginError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setLoginError(null);
    setIsSubmitting(true);

    try {
      const loginResponse = await login({
        email: email.trim(),
        password,
      });

      setAuth(loginResponse.accessToken, email.trim());
      navigate("/memos", { replace: true });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setLoginError("*아이디 또는 비밀번호가 옳지 않습니다");
      } else {
        setIsNetworkErrorModalOpen(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="flex min-h-screen items-center justify-center bg-blue-01 px-6 font-sans">
        <form
          className="flex w-full max-w-140 flex-col gap-10"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-4">
              <AuthTextField
                id="login-email"
                label="아이디"
                type="email"
                value={email}
                placeholder="아이디를 입력하세요"
                autoComplete="email"
                onChange={handleEmailChange}
              />

              <AuthTextField
                id="login-password"
                label="비밀번호"
                type="password"
                value={password}
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
                onChange={handlePasswordChange}
              />
            </div>

            {loginError && (
              <p className="text-body-small text-point" role="alert">
                {loginError}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center gap-7">
            <AuthButton disabled={!canSubmit}>
              {isSubmitting ? "로그인 중..." : "로그인"}
            </AuthButton>

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

      {isNetworkErrorModalOpen && (
        <CommonModal
          title="로그인에 실패했습니다"
          message="네트워크 연결 상태를 확인한 뒤 다시 시도해주세요."
          onConfirm={() => setIsNetworkErrorModalOpen(false)}
        />
      )}
    </>
  );
}

export default LoginPage;
