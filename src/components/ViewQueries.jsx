import { useState } from 'react';
import { Search, Play } from 'lucide-react';

const ViewQueries = ({ queries }) => {
  const [selectedQuery, setSelectedQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    if (!selectedQuery) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`/api/query/${selectedQuery}`);
      const data = await response.json().catch(() => null);
      
      // Dummy results
      const dummyResults = queries.find(q => q.id === selectedQuery)?.dummyData || [];
      setResults(dummyResults);
    } catch (error) {
      console.error('Query error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl shadow-lg border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Search className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-bold text-foreground">Execute Queries</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Query
            </label>
            <select
              value={selectedQuery}
              onChange={(e) => setSelectedQuery(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Choose a query...</option>
              {queries.map(query => (
                <option key={query.id} value={query.id}>
                  {query.name}
                </option>
              ))}
            </select>
          </div>
          
          {selectedQuery && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-mono text-muted-foreground">
                {queries.find(q => q.id === selectedQuery)?.description}
              </p>
            </div>
          )}
          
          <button
            onClick={handleExecute}
            disabled={!selectedQuery || loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Play className="h-5 w-5" />
            {loading ? 'Executing...' : 'Execute Query'}
          </button>
        </div>
      </div>
      
      {results !== null && (
        <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h4 className="text-lg font-bold text-foreground">Query Results</h4>
          </div>
          
          <div className="overflow-x-auto">
            {results.length > 0 ? (
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    {Object.keys(results[0]).map(col => (
                      <th key={col} className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {results.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="px-6 py-4 text-sm text-foreground">
                          {val || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewQueries;
