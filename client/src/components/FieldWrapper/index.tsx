const FILE_TYPES = {
  csv: ".csv",
};

export type FieldWrapperProps = {
  name: string;
  label: string;
};

export const FieldWrapper = ({
  children,
  name,
  label,
}: React.PropsWithChildren<FieldWrapperProps>) => {
  return (
    <div className="fieldWrapper">
      <label htmlFor={name}>{label}</label>
      {children}
    </div>
  );
};
