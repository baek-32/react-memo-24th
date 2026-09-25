import type { MouseEventHandler } from "react";

interface IconButtonProps {
  icon: string;
  label: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

function IconButton({
  icon,
  label,
  type = "button",
  className = "",
  onClick,
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
      onClick={onClick}
    >
      <img src={icon} alt="" />
    </button>
  );
}

export default IconButton;
