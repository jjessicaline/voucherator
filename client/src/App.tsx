import { useState } from "react";
import "./App.css";
import { FileInput, Input } from "./components/Form";
import { buildFormData } from "./helpers/buildFormData";
import {} from "./components/Input";
import useMutation from "./hooks/useMutation";
import { JsonRenderer } from "./components/JsonRenderer";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [folder, setFolder] = useState<string | null>(null);
  const [rows, setRows] = useState<object[] | null>(null);

  const { mutate, loading, error, data } = useMutation<{
    count: number;
    records: object[];
    success: boolean;
  }>("/api/parse");

  const onSubmit = async () => {
    const formData = buildFormData({ file, folder });

    const result = await mutate(formData);

    if (result) {
      console.log(result);
      setRows(result.records);
    }
  };

  return (
    <>
      <form>
        <FileInput
          name="csv-source"
          label="Arquivo: "
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          fileTypes={["csv"]}
          disabled={!!rows && loading}
        />
        <Input
          name="folder-name"
          label="Nome da pasta: "
          onChange={(e) => setFolder(e.target.value)}
          type="text"
          readOnly={!!rows && loading}
        />
        <button type="button" onClick={onSubmit}>
          Enviar
        </button>
      </form>
      {loading && (
        <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGY4NGJ1dnB4aGN1cmRsNGRzOTAwcjNmaTVhMjBnaHEzZmg1bWF2OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pVXyJy2k7WO1n49bGg/giphy.gif" />
      )}
      {!loading && rows && (
        <>
          <h2>PDFs:</h2>
          <JsonRenderer data={rows} />
        </>
      )}
    </>
  );
}

export default App;
