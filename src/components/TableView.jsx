import { useState } from 'react';
import { Search } from 'lucide-react';

const TableView = ({ data, columns, title }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {columns.map(col => (
                <th key={col} className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/50 transition-colors">
                  {columns.map(col => (
                    <td key={col} className="px-6 py-4 text-sm text-foreground">
                      {row[col] || '-'}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-muted-foreground">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;
