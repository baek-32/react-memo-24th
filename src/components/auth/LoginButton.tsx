interface LoginButtonProps {
  disabled: boolean;
}

function LoginButton({ disabled }: LoginButtonProps) {
  return (
    <button
      className="h-14 w-full rounded-xl bg-blue-05 px-5 py-4 text-action-medium font-extrabold text-white-00 disabled:cursor-not-allowed disabled:bg-blue-03 disabled:text-gray-01"
      type="submit"
      disabled={disabled}
    >
      로그인
    </button>
  );
}

export default LoginButton;
