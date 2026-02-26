export const JsonRenderer = ({ data }: { data: object[] }) => {
  if (!data || !data[0]) return null;

  const headers = Object.keys(data[0]);
  return (
    <table>
      <thead>
        <tr>
          {headers.map((column) => (
            <th key={`column-${column}`}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={`json-row-${index}`}>
            {Object.values(row).map((columnData, index) => (
              <td key={`json-row-${index}-col-${index}`}>{columnData}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
