interface AuthTextFieldProps {
  id: string;
  label: string;
  type: "email" | "password";
  value: string;
  placeholder: string;
  autoComplete: "email" | "current-password" | "new-password";
  errorMessage?: string;
  onChange: (value: string) => void;
}

function AuthTextField({
  id,
  label,
  type,
  value,
  placeholder,
  autoComplete,
  errorMessage,
  onChange,
}: AuthTextFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        className="h-14 w-full rounded-xl bg-white-00 px-5 text-field-medium font-regular text-gray-04 outline-none placeholder:text-gray-02"
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={errorMessage ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />

      {errorMessage && (
        <p id={errorId} className="text-body-small text-point">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default AuthTextField;