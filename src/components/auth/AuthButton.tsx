import type { ReactNode } from "react";

interface AuthButtonProps {
  children: ReactNode;
  disabled: boolean;
}

function AuthButton({ children, disabled }: AuthButtonProps) {
  return (
    <button
      className="h-14 w-full rounded-xl bg-blue-05 px-5 py-4 text-action-medium font-extrabold text-white-00 disabled:cursor-not-allowed disabled:bg-blue-03 disabled:text-gray-01"
      type="submit"
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default AuthButton;