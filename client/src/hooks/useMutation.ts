import { useState } from "react";
import { API_URL } from "../config";

type MutationState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

type UseMutationReturn<T> = MutationState<T> & {
  mutate: (body: FormData | Record<string, unknown>) => Promise<T | null>;
};

function useMutation<T>(
  url: string,
  method: "POST" | "PUT" | "DELETE" = "POST",
): UseMutationReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    body: FormData | Record<string, unknown>,
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    const isFormData = body instanceof FormData;

    try {
      const response = await fetch(`${API_URL}${url}`, {
        method,
        body: isFormData ? body : JSON.stringify(body),
        headers: isFormData
          ? undefined
          : { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: T = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, mutate };
}

export default useMutation;
