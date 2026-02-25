export const JsonRenderer = ({ data }: { data: object[] }) => {
  if (!data || !data[0]) return null;

  const headers = Object.keys(data[0]);
  return (
    <table>
      <thead>
        {headers.map((column) => (
          <th>{column}</th>
        ))}
      </thead>
      <tbody>
        {data.map((row) => (
          <tr>
            {Object.values(row).map((columnData) => (
              <td>{columnData}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
