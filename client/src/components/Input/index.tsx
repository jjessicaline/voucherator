import { FieldWrapper, type FieldWrapperProps } from "../FieldWrapper";

export type InputProps = FieldWrapperProps & {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  info?: string;
} & Pick<HTMLInputElement, "type" | "readOnly" | "size">;

export const Input = ({
  onChange,
  label,
  name,
  type,
  readOnly,
  size,
  info,
}: InputProps) => {
  return (
    <FieldWrapper label={label} name={name}>
      <div>
        <input
          type={type}
          name={name}
          onChange={(e) => onChange(e)}
          readOnly={readOnly}
          size={size}
        />
        {info && <p className="input-info">{info}</p>}
      </div>
    </FieldWrapper>
  );
};
