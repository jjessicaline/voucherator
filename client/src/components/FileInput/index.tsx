import { FieldWrapper, type FieldWrapperProps } from "../FieldWrapper";

const FILE_TYPES = {
  csv: ".csv",
};

export type FileInputProps = FieldWrapperProps & {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileTypes: Array<keyof typeof FILE_TYPES>;
} & Pick<HTMLInputElement, "disabled">;

export const FileInput = ({
  onChange,
  label,
  name,
  fileTypes,
  disabled,
}: FileInputProps) => {
  return (
    <FieldWrapper label={label} name={name}>
      <input
        type="file"
        name={name}
        onChange={(e) => onChange(e)}
        accept={fileTypes.map((fileType) => FILE_TYPES[fileType]).join(", ")}
        disabled={disabled}
      />
    </FieldWrapper>
  );
};
