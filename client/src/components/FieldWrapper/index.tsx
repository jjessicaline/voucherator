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
    <div className="field-wrapper">
      <label htmlFor={name}>{label}</label>
      {children}
    </div>
  );
};
