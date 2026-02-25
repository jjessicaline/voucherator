export function buildFormData(
  fields: Record<string, string | File | null | undefined>,
): FormData {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  return formData;
}
