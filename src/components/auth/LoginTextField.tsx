type LoginFieldType = "id" | "password";

interface LoginTextFieldProps {
  id: string;
  fieldType: LoginFieldType;
  value: string;
  onChange: (value: string) => void;
}

const fieldConfig = {
  id: {
    label: "아이디",
    inputType: "email",
    placeholder: "아이디를 입력하세요",
    autoComplete: "email",
  },
  password: {
    label: "비밀번호",
    inputType: "password",
    placeholder: "비밀번호를 입력하세요",
    autoComplete: "current-password",
  },
} as const;

function LoginTextField({
  id,
  fieldType,
  value,
  onChange,
}: LoginTextFieldProps) {
  const config = fieldConfig[fieldType];

  return (
    <div>
      <label className="sr-only" htmlFor={id}>
        {config.label}
      </label>
      <input
        id={id}
        className="h-14 w-full rounded-xl bg-white-00 px-5 text-field-medium font-regular text-gray-04 outline-none placeholder:text-gray-02"
        type={config.inputType}
        value={value}
        placeholder={config.placeholder}
        autoComplete={config.autoComplete}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export default LoginTextField;
