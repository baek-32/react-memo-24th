import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signup } from "../api/auth";
import { ApiError } from "../api/client";
import AuthButton from "../components/auth/AuthButton";
import AuthTextField from "../components/auth/AuthTextField";
import CommonModal from "../components/CommonModal";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [serverEmailError, setServerEmailError] = useState<string | null>(null);
  const [serverPasswordError, setServerPasswordError] = useState<
    string | null
  >(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignupCompleteModalOpen, setIsSignupCompleteModalOpen] =
    useState(false);
  const [isNetworkErrorModalOpen, setIsNetworkErrorModalOpen] =
    useState(false);

  const trimmedEmail = email.trim();
  const isEmailValid = EMAIL_PATTERN.test(trimmedEmail);
  const isPasswordValid = password.length >= 8;
  const isPasswordConfirmValid =
    passwordConfirm !== "" && password === passwordConfirm;

  const emailError =
    email !== "" && !isEmailValid
      ? "올바른 이메일 형식을 입력해주세요."
      : (serverEmailError ?? undefined);

  const passwordError =
    password !== "" && !isPasswordValid
      ? "비밀번호는 8자 이상이어야 합니다."
      : (serverPasswordError ?? undefined);

  const passwordConfirmError =
    passwordConfirm !== "" && !isPasswordConfirmValid
      ? "비밀번호가 일치하지 않습니다."
      : undefined;

  const canSubmit =
    isEmailValid &&
    isPasswordValid &&
    isPasswordConfirmValid &&
    !isSubmitting;

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setServerEmailError(null);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setServerPasswordError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setServerEmailError(null);
    setServerPasswordError(null);
    setIsSubmitting(true);

    try {
      await signup({
        email: trimmedEmail,
        password,
      });

      setIsSignupCompleteModalOpen(true);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setServerEmailError(error.message);
      } else if (error instanceof ApiError && error.status === 400) {
        if (error.message.includes("이메일")) {
          setServerEmailError(error.message);
        } else {
          setServerPasswordError(error.message);
        }
      } else {
        setIsNetworkErrorModalOpen(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupComplete = () => {
    setIsSignupCompleteModalOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
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
              onChange={handleEmailChange}
            />

            <AuthTextField
              id="signup-password"
              label="비밀번호"
              type="password"
              value={password}
              placeholder="비밀번호를 입력하세요"
              autoComplete="new-password"
              errorMessage={passwordError}
              onChange={handlePasswordChange}
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
            <AuthButton disabled={!canSubmit}>
              {isSubmitting ? "가입 중..." : "회원가입"}
            </AuthButton>

            <p className="text-body-medium font-regular text-gray-03">
              이미 계정이 있으신가요?{" "}
              <Link className="font-bold text-blue-05" to="/login">
                로그인
              </Link>
            </p>
          </div>
        </form>
      </main>

      {isSignupCompleteModalOpen && (
        <CommonModal
          title="회원가입이 완료되었습니다"
          message="로그인 화면에서 새 계정으로 로그인해주세요."
          onConfirm={handleSignupComplete}
        />
      )}

      {isNetworkErrorModalOpen && (
        <CommonModal
          title="회원가입에 실패했습니다"
          message="네트워크 연결 상태를 확인한 뒤 다시 시도해주세요."
          onConfirm={() => setIsNetworkErrorModalOpen(false)}
        />
      )}
    </>
  );
}

export default SignupPage;
