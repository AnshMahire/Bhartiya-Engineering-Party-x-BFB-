function Table({ columns, rows, emptyMessage = "No records available", renderActions }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left font-semibold text-gray-600">
                  {column.label}
                </th>
              ))}
              {renderActions ? <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-4 py-6 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="border-t border-gray-100">
                  {columns.map((column) => (
                    <td key={`${row.id || rowIndex}-${column.key}`} className="px-4 py-3 text-gray-700">
                      {row[column.key]}
                    </td>
                  ))}
                  {renderActions ? <td className="px-4 py-3">{renderActions(row)}</td> : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
