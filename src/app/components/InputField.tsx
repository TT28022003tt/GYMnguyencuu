import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  className?:string;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
  className,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full ">
      <label className="text-sm ">{label}</label>
      <input
        type={type}
        {...register(name, { valueAsNumber: type === "number" })}
        className={`bg-white  ring-[1.5px] ring-gray-300 p-2 rounded-md text-black text-sm w-full ${className || ''}`}
        {...inputProps}
        defaultValue={defaultValue}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;