import { FieldWrapper, type FieldWrapperProps } from "../FieldWrapper";

export type InputProps = FieldWrapperProps & {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & Pick<HTMLInputElement, "type" | "readOnly">;

export const Input = ({
  onChange,
  label,
  name,
  type,
  readOnly,
}: InputProps) => {
  return (
    <FieldWrapper label={label} name={name}>
      <input
        type={type}
        name={name}
        onChange={(e) => onChange(e)}
        readOnly={readOnly}
      />
    </FieldWrapper>
  );
};
